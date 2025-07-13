import { getPage, nextLink, queryParameters, getNextPage, omitShard, getPaginationFromRequest } from "@lib/pagination/pagination.utils";
import { PAGINATION_OPTIONS } from "@lib/pagination/pagination.constants";
import { FastifyRequest } from "fastify";

describe("pagination.utils", () => {
  describe("getPage", () => {
    it("should return default page and shard if not provided", () => {
      const page = getPage();
      expect(page.num).toBe(PAGINATION_OPTIONS.FIRST_PAGE);
      expect(page.size).toBe(PAGINATION_OPTIONS.PAGE_SIZE);
      expect(page.shard).toBeUndefined();
    });
    it("should return provided page and shard", () => {
      const page = getPage(2, 3);
      expect(page.num).toBe(2);
      expect(page.size).toBe(PAGINATION_OPTIONS.PAGE_SIZE);
      expect(page.shard).toBe(3);
    });
  });

  describe("nextLink", () => {
    it("should return undefined if nextPage is not provided", () => {
      const req = { protocol: "http", hostname: "localhost", raw: { url: "/api" } } as unknown as FastifyRequest;
      expect(nextLink({ nextPage: undefined, request: req })).toBeUndefined();
    });
    it("should return correct next link", () => {
      const req = { protocol: "http", hostname: "localhost", raw: { url: "/api/events?page=1" } } as unknown as FastifyRequest;
      const link = nextLink({ nextPage: { num: 2, size: 10, shard: 1 }, request: req });
      expect(link).toContain("page=2");
      expect(link).toContain("shard=1");
    });
  });

  describe("queryParameters", () => {
    it("should calculate skip and take correctly", () => {
      const params = queryParameters({ page: { num: 2, size: 10, shard: 1 } });
      expect(params.skip).toBe(10);
      expect(params.take).toBe(10);
      expect(params.where.shard).toBe(1);
    });
    it("should use default shard if not provided", () => {
      const params = queryParameters({ page: { num: 1, size: 10 } });
      expect(params.where.shard).toBe(PAGINATION_OPTIONS.DEFAULT_SHARD);
    });
  });

  describe("omitShard", () => {
    it("should omit shard property", () => {
      const obj = { foo: 1, shard: 2 };
      const result = omitShard(obj);
      expect(result).toEqual({ foo: 1 });
    });
  });

  describe("getPaginationFromRequest", () => {
    it("should parse page and shard from query", () => {
      const req = { query: { page: "3", shard: "2" } } as unknown as FastifyRequest;
      const page = getPaginationFromRequest(req);
      expect(page.num).toBe(3);
      expect(page.shard).toBe(2);
    });
    it("should use defaults if query params are missing", () => {
      const req = { query: {} } as unknown as FastifyRequest;
      const page = getPaginationFromRequest(req);
      expect(page.num).toBe(PAGINATION_OPTIONS.FIRST_PAGE);
      expect(page.shard).toBeUndefined();
    });
  });

  describe("getNextPage", () => {
    it("should return next page in same shard if available", async () => {
      const collection = { count: jest.fn().mockResolvedValueOnce(5) };
      const currentPage = { num: 1, size: 10, shard: 0 };
      const next = await getNextPage({ currentPage, collection });
      expect(next).toBeDefined();
      expect(next?.num).toBe(2);
      expect(next?.shard).toBe(0);
    });
    it("should return next page in next shard if current shard is empty", async () => {
      const collection = { count: jest.fn()
        .mockResolvedValueOnce(0) // next page in current shard
        .mockResolvedValueOnce(3) // first page in next shard
      };
      const currentPage = { num: 1, size: 10, shard: 0 };
      const next = await getNextPage({ currentPage, collection });
      expect(next).toBeDefined();
      expect(next?.num).toBe(1);
      expect(next?.shard).toBe(1);
    });
    it("should return undefined if no more pages", async () => {
      const collection = { count: jest.fn()
        .mockResolvedValueOnce(0) // next page in current shard
        .mockResolvedValueOnce(0) // first page in next shard
      };
      const currentPage = { num: 1, size: 10, shard: PAGINATION_OPTIONS.MAX_SHARDS };
      const next = await getNextPage({ currentPage, collection });
      expect(next).toBeUndefined();
    });
  });
});
