import { createClient, RedisClientType } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";
import { Express } from "express";


class RedisClientWrapper {
    public redisClient: RedisClientType;
    public redisStore: RedisStore;

    constructor(client: RedisClientType) {
        this.redisClient = client;
        this.redisStore = new RedisStore({
            client: this.redisClient as any, // TypeScript workaround for RedisStore compatibility
            prefix: "myapp:",
        });
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.redisClient.get(key);
        } catch (err) {
            console.error(`Error getting key ${key}: ${err}`);
            throw err;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            await this.redisClient.set(key, value);
        } catch (err) {
            console.error(`Error setting key ${key}: ${err}`);
            throw err;
        }
    }
}

class RedisClientSingleton {
    private static instance: RedisClientWrapper | null = null;

    static async getInstance(): Promise<RedisClientWrapper> {
        if (!RedisClientSingleton.instance) {
            console.log("🔄 Creating Redis client...",process.env.REDIS_URL);
            const client: RedisClientType = createClient({
                url: `${process.env.REDIS_URL}`,
            });

            client.on("error", (err: Error) => {
                console.error(`Error connecting to Redis: ${err.message}`);
            });

            try {
                await client.connect();
                console.log("Redis client connected successfully");
                RedisClientSingleton.instance = new RedisClientWrapper(client);
            } catch (err) {
                console.error(`Failed to connect to Redis: ${err}`);
                throw err;
            }
        }
        return RedisClientSingleton.instance;
    }
}

const initRedis = async (app: Express) => {
    try {
        console.log("🔄 Initializing Redis...");
        const redis = await RedisClientSingleton.getInstance();

        app.use(session({
            store: redis.redisStore, // Redis session store
            secret: process.env.SESSION_SECRET || "INNORIX", // Use an environment variable for security
            resave: false,
            saveUninitialized: false,
        }));

        console.log("✅ Redis initialized and session middleware configured.");
    } catch (err) {
        console.error("❌ Failed to initialize Redis:", err);
        process.exit(1); // Exit the process if Redis connection fails
    }
};

export { RedisClientSingleton, initRedis };