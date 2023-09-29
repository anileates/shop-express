import { RedisClientType, createClient } from "redis";

/**
 * @description This class is used to initialize and manage the Redis client
 */
const redisClient = createClient({ url: process.env.REDIS_URL });

const getRedisClient = async () => {
    // Singleton
    if (redisClient.isOpen) {
        return redisClient;
    }

    await redisClient.connect();
    return redisClient;
}

const killRedisClient = async () => {
    if(redisClient.isOpen) await redisClient.disconnect();
}

export {
    getRedisClient,
    killRedisClient
}