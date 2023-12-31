import { FreeProductPromotion } from "../../entity/freeProductPromotion.entity";
import { PercentageDiscountPromotion } from "../../entity/percentageDiscountPromotion.entity";
import { getRedisClient } from "./redis.helper";
import { CachedDiscountPromotion, CachedFreeProductPromotion } from "./redis.types";

/**
 * @description This function is used to load all the promotions from MySQL database to Redis when the app is started
 */
const addPromotionsToRedis = async () => {
    const redisClient = await getRedisClient();

    const discounts: PercentageDiscountPromotion[] = await PercentageDiscountPromotion.find();
    const freeProductPromotions: FreeProductPromotion[] = await FreeProductPromotion.createQueryBuilder('freeProductPromotion').getMany();

    await Promise.all([
        ...discounts.map(async (discount: PercentageDiscountPromotion) => {
            await redisClient.set(`discount:${discount.promotion_id}`, JSON.stringify(discount));
        }),

        ...freeProductPromotions.map(async (freeProductPromotion: FreeProductPromotion) => {
            await redisClient.set(`freeProduct:${freeProductPromotion.promotion_id}`, JSON.stringify(freeProductPromotion));
        }),
    ])
}

const addDiscountToRedis = async (discount: PercentageDiscountPromotion) => {
    const redisClient = await getRedisClient();

    await redisClient.set(`discount:${discount.promotion_id}`, JSON.stringify(discount));
}

const addFreeProductPromotionToRedis = async (freeProductPromotion: FreeProductPromotion) => {
    const redisClient = await getRedisClient();

    await redisClient.set(`freeProduct:${freeProductPromotion.free_product_id}`, JSON.stringify(freeProductPromotion));
}

const getDiscountsFromRedis = async (): Promise<CachedDiscountPromotion[]> => {
    const redisClient = await getRedisClient();

    const discounts = await redisClient.scan(0, { MATCH: 'discount:*', COUNT: 1000 })

    const discountValues = await Promise.all([
        ...discounts.keys.map(async (discountKey: string) => {
            const discount = await redisClient.get(discountKey);
            return JSON.parse(discount!);
        })
    ])

    return discountValues;
}

const getFreeProductPromotionsFromRedis = async (): Promise<CachedFreeProductPromotion[]> => {
    const redisClient = await getRedisClient();

    const foundPromo: string[] = [];
    let cursor = 0;

    do {
        // Unlike the discount promotions, there can be a lot of free product promotions. So we need to scan for all of them using the cursor for the sake of performance
        const reply = await redisClient.scan(cursor, { MATCH: 'freeProduct:*' })

        cursor = reply.cursor;
        foundPromo.push(...reply.keys);
    } while (cursor !== 0);

    const freeProductPromotions = await Promise.all([
        ...foundPromo.map(async (freeProductPromotionKey: string) => {
            const freeProductPromotion = await redisClient.get(freeProductPromotionKey);
            return JSON.parse(freeProductPromotion!);
        })
    ])

    return freeProductPromotions;
}

const removeDiscountFromRedis = async (discountId: number) => {
    const redisClient = await getRedisClient();

   await redisClient.del(`discount:${discountId}`);
}

const removeFreeProductPromotionFromRedis = async (freeProductPromotionId: number) => {
    const redisClient = await getRedisClient();

    await redisClient.del(`freeProduct:${freeProductPromotionId}`);
}

export {
    addPromotionsToRedis,
    removeDiscountFromRedis,
    addDiscountToRedis,
    addFreeProductPromotionToRedis,
    getDiscountsFromRedis,
    getFreeProductPromotionsFromRedis,
    removeFreeProductPromotionFromRedis
}