import { Product } from "../../entity/product.entity";
import { getRedisClient } from "./redis.helper";

const addStockQuantitiesToRedis = async () => {
    const redisClient = await getRedisClient();

    const productsWithStock = await Product.createQueryBuilder('product')
        .select(['product.product_id', 'product.stock_quantity'])
        .getMany()

    // Add the products with stock to Redis individually
    await Promise.all([
        ...productsWithStock.map(async (product: Product) => {
            await redisClient.set(`product:${product.product_id}:stock`, JSON.stringify(product));
        })
    ])
}

const getStockFromRedis = async (product_id: number) => {
    const redisClient = await getRedisClient();

    const productWithStock = await redisClient.get(`product:${product_id}:stock`);

    return productWithStock
}

export {
    addStockQuantitiesToRedis,
    getStockFromRedis
}