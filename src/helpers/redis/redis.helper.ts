import { RedisClientType, createClient } from "redis";

/**
 * @description This class is used to initialize and manage the Redis client
 */
const redisClient: RedisClientType = createClient({ url: process.env.REDIS_URL });

const getRedisClient = async (): Promise<RedisClientType> => {
    // Singleton
    if (redisClient.isOpen) {
        return redisClient;
    }

    return await redisClient.connect();
}

const killRedisClient = async () => {
    if(redisClient.isOpen) await redisClient.disconnect();
}

export {
    getRedisClient,
    killRedisClient
}