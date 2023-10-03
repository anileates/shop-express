import { Product } from "../entity/product.entity";
import { getRedisClient } from "../helpers/redis/redis.helper";

export default class ProductService {
    constructor() { }

    public async decreaseStock(productId: number, quantity: number): Promise<Product | undefined> {
        try {
            let product = await Product.findOne({ where: { product_id: productId } })
            if (product) {
                product.stock_quantity -= quantity; 

                const redisClient = await getRedisClient();
    
                await redisClient.set(`product:${product.product_id}:stock`, JSON.stringify(
                    {
                        product_id: product.product_id,
                        stock_quantity: product.stock_quantity
                    }
                ));
            }

            return await product?.save();
        } catch (error) {
            throw error;
        }
    }
}