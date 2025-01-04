import { createClient, RedisClientType } from "redis";

class Redis {
  private static instance: Redis | null = null;
  #client: RedisClientType;
  private isConnected = false;

  private constructor() {
    this.#client = createClient();

    this.#client.on("error", (err) => {
      throw err;
    });

    this.#client.on("ready", () => {
      this.isConnected = true;
    });

    this.#client.on("end", () => {
      this.isConnected = false;
    });
  }

  static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }

    return Redis.instance;
  }

  async connect() {
    if (!this.isConnected) {
      try {
        await this.#client.connect();
      } catch (err) {
        throw new Error("Redis connection failed");
      }
    }
  }

  async set(
    key: string,
    value: string | number,
    duration: number
  ): Promise<void> {
    try {
      await this.#client.set(key, value.toString(), { EX: duration });
    } catch (err) {
      throw new Error("Redis set operation failed");
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.#client.get(key);
      return value;
    } catch (err) {
      throw new Error("Redis get operation failed");
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.#client.del(key);
    } catch (err) {
      throw new Error("Redis delete operation failed");
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.#client.disconnect();
      } catch (err) {
        throw new Error("Redis disconnection failed");
      }
    }
  }
}

export const redis = Redis.getInstance();
