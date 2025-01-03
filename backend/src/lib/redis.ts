import { createClient, RedisClientType } from "redis";

class Redis {
  #client: RedisClientType;

  constructor() {
    this.#client = createClient();

    this.#client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }

  async connect() {
    try {
      await this.#client.connect();
      console.log("Connected successfully to Redis!");
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
      throw new Error("Redis connection failed");
    }
  }

  async set(key: string, value: string | number, duration: number): Promise<void> {
    try {
      await this.#client.set(key, value.toString(), { EX: duration });
    } catch (err) {
      console.error(`Error setting key "${key}" in Redis:`, err);
      throw new Error("Redis set operation failed");
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.#client.get(key);
      return value;
    } catch (err) {
      console.error(`Error getting key "${key}" from Redis:`, err);
      throw new Error("Redis get operation failed");
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.#client.del(key);
    } catch (err) {
      console.error(`Error deleting key "${key}" from Redis:`, err);
      throw new Error("Redis delete operation failed");
    }
  }
}

export const redis = new Redis();
