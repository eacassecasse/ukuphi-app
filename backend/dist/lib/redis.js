"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Redis_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("redis");
class Redis {
    constructor() {
        _Redis_client.set(this, void 0);
        this.isConnected = false;
        __classPrivateFieldSet(this, _Redis_client, (0, redis_1.createClient)(), "f");
        __classPrivateFieldGet(this, _Redis_client, "f").on("error", (err) => {
            throw err;
        });
        __classPrivateFieldGet(this, _Redis_client, "f").on("ready", () => {
            this.isConnected = true;
        });
        __classPrivateFieldGet(this, _Redis_client, "f").on("end", () => {
            this.isConnected = false;
        });
    }
    static getInstance() {
        if (!Redis.instance) {
            Redis.instance = new Redis();
        }
        return Redis.instance;
    }
    async connect() {
        if (!this.isConnected) {
            try {
                await __classPrivateFieldGet(this, _Redis_client, "f").connect();
            }
            catch (err) {
                console.log(err);
                throw new Error("Redis connection failed");
            }
        }
    }
    async set(key, value, duration) {
        try {
            await __classPrivateFieldGet(this, _Redis_client, "f").set(key, value.toString(), { EX: duration });
        }
        catch (err) {
            throw new Error("Redis set operation failed");
        }
    }
    async get(key) {
        try {
            const value = await __classPrivateFieldGet(this, _Redis_client, "f").get(key);
            return value;
        }
        catch (err) {
            throw new Error("Redis get operation failed");
        }
    }
    async delete(key) {
        try {
            await __classPrivateFieldGet(this, _Redis_client, "f").del(key);
        }
        catch (err) {
            throw new Error("Redis delete operation failed");
        }
    }
    async disconnect() {
        if (this.isConnected) {
            try {
                await __classPrivateFieldGet(this, _Redis_client, "f").disconnect();
            }
            catch (err) {
                throw new Error("Redis disconnection failed");
            }
        }
    }
}
_Redis_client = new WeakMap();
Redis.instance = null;
exports.redis = Redis.getInstance();
