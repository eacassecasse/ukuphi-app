import { PrismaClient } from "@prisma/client";
import { FastifyBaseLogger } from "fastify";

export class PrismaService extends PrismaClient {
  private static instance: PrismaService;
  private logger: FastifyBaseLogger;

  private constructor(logger: FastifyBaseLogger) {
    super({
      log: [
        { level: "error", emit: "event" },
        { level: "query", emit: "event" },
        { level: "warn", emit: "event" },
      ],
    });
    this.logger = logger;
    this.setupEventListeners();
  }

  public static getInstance(logger: FastifyBaseLogger): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService(logger);
    }

    return PrismaService.instance;
  }

  private setupEventListeners() {
    this.$on("warn", (e: any) => this.logger.warn(e.message));
    this.$on("error", (e: any) => this.logger.error(e.message));

    if (process.env.NODE_ENV === "development") {
      this.$on("query", (e: any) => {
        this.logger.debug(
          `Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`
        );
      });
    }
  }

  public async connect() {
    await this.$connect();
    this.logger.info("Prisma connected to the database");
  }

  public async disconnect() {
    await this.$disconnect();
    this.logger.info("Prisma disconnected from the database");
  }
}
