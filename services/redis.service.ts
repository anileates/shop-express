import { PercentageDiscountPromotion } from '../entity/percentageDiscountPromotion.entity';
import { FreeProductPromotion } from '../entity/freeProductPromotion.entity';
import { getRedisClient } from '../helpers/redis/redis.helper';
import { Product } from '../entity/product.entity';

/**
 * @description This function is used to load all the promotions from MySQL database to Redis when the app is started
 */
const addPromotionsToRedis = async () => {
    const redisClient = await getRedisClient();

    // Get all the promotions from MySQL database
    const discounts: PercentageDiscountPromotion[] = await PercentageDiscountPromotion.find();
    const freeProductPromotions: FreeProductPromotion[] = await FreeProductPromotion.find();

    // Load the discounts and freeProducts to Redis
    await Promise.all([
        await redisClient.set('discounts', JSON.stringify(discounts)),
        await redisClient.set('freeProductPromotions', JSON.stringify(freeProductPromotions)),
    ])
}

/**
 * @description This function is used to get all the promotions from Redis
 */
const getPromotionsFromRedis = async () => {
    const redisClient = await getRedisClient();

    const activeDiscounts = await redisClient.get('discounts');
    const activeFreeProductPromotions = await redisClient.get('freeProductPromotions');

    return {
        activeDiscounts,
        activeFreeProductPromotions
    }
}

const addStockQuantitiesToRedis = async () => {
    const redisClient = await getRedisClient();

    const productsWithStock = await Product.createQueryBuilder('product')
        .select(['product.product_id', 'product.stock_quantity'])
        .getMany()

    // Add the products with stock to Redis
    await redisClient.set('productsWithStock', JSON.stringify(productsWithStock));
}

const getStockQuantitiesFromRedis = async () => {
    const redisClient = await getRedisClient();

    const productsWithStock = await redisClient.get('productsWithStock');

    return {
        productsWithStock
    }
}

export {
    addPromotionsToRedis,
    getPromotionsFromRedis,
    addStockQuantitiesToRedis,
    getStockQuantitiesFromRedis
}