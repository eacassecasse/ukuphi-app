import { PAGINATION_OPTIONS } from "@lib/pagination/pagination.constants";
import { CountableCollection, Page } from "@lib/pagination/pagination.types";
import { FastifyRequest } from "fastify";

function parseOptionalInt(value?: string): number | undefined {
  if (value === undefined || value === null) return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

function urlWithoutQueryParameters(request: FastifyRequest): string {
  const protocol = request.protocol;
  const hostname = request.hostname;
  const path = request.raw.url?.split("?")[0] || "";
  return `${protocol}://${hostname}${path}`;
}

export function getPage(pageNum?: number, shard?: number): Page {
  return {
    num: pageNum ?? PAGINATION_OPTIONS.FIRST_PAGE,
    size: PAGINATION_OPTIONS.PAGE_SIZE,
    shard,
  };
}

export function nextLink(parameters: {
  nextPage?: Page;
  request: FastifyRequest;
}): string | undefined {
  const { nextPage, request } = parameters;
  if (!nextPage) return undefined;

  const baseUrl = urlWithoutQueryParameters(request);
  const params = new URLSearchParams();
  params.set(PAGINATION_OPTIONS.PAGE_QUERY_PARAM, nextPage.num.toString());
  if (nextPage.shard !== undefined) {
    params.set(PAGINATION_OPTIONS.SHARD_QUERY_PARAM, nextPage.shard.toString());
  }
  return `${baseUrl}?${params.toString()}`;
}

export function queryParameters(parameters: { page: Page }): {
  skip: number;
  take: number;
  where: { shard: number };
} {
  const { page } = parameters;
  return {
    take: page.size,
    skip: (page.num - 1) * page.size, // Fixed to be 0-based for first page
    where: { shard: page.shard ?? PAGINATION_OPTIONS.DEFAULT_SHARD },
  };
}

async function countOnPage(
  page: Page,
  collection: CountableCollection
): Promise<number> {
  return collection.count(queryParameters({ page }));
}

export async function getNextPage(parameters: {
  currentPage: Page;
  collection: CountableCollection;
}): Promise<Page | undefined> {
  const { currentPage, collection } = parameters;
  const nextPageNum = currentPage.num + 1;
  const nextPageInShard = getPage(nextPageNum, currentPage.shard);

  const countRemainingInShard = await countOnPage(nextPageInShard, collection);

  if (countRemainingInShard > 0) {
    return nextPageInShard;
  }

  const nextShard = (currentPage.shard ?? PAGINATION_OPTIONS.DEFAULT_SHARD) + 1;

  if (nextShard > PAGINATION_OPTIONS.MAX_SHARDS) {
    return undefined;
  }

  const pageInNextShard = getPage(PAGINATION_OPTIONS.FIRST_PAGE, nextShard);

  const countInNextShard = await countOnPage(pageInNextShard, collection);

  if (countInNextShard > 0) {
    return pageInNextShard;
  }

  return undefined;
}

export function omitShard<T extends { shard?: number }>(
  obj: T
): Omit<T, "shard"> {
  const { shard: _, ...rest } = obj;
  return rest;
}

export function getPaginationFromRequest(request: FastifyRequest): Page {
  const query = request.query as Record<string, string | undefined>;
  const page = parseOptionalInt(query[PAGINATION_OPTIONS.PAGE_QUERY_PARAM]);
  const shard = parseOptionalInt(query[PAGINATION_OPTIONS.SHARD_QUERY_PARAM]);
  return getPage(page, shard);
}
