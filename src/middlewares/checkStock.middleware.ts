import { Request, Response, NextFunction } from "express"
import { CreateOrderDto, individualOrder } from "../dto/createOrder.dto";
import { getStockFromRedis } from "../helpers/redis/stock.redis";
import { CachedStockQuantity } from "../helpers/redis/redis.types";

const checkStock = async (req: Request, res: Response, next: NextFunction) => {
    const order: CreateOrderDto = req.body;

    try {
        for (const product of order.products) {
            const stockInfo: CachedStockQuantity | undefined = await getStockFromRedis(product.productId);

            if(!stockInfo) return res.status(400).json({
                message: `The product with id ${product.productId} does not exist.`
            })

            if (stockInfo.stock_quantity < product.quantity) {
                return res.status(400).json({
                    message: `The stock of product with id ${stockInfo.product_id} is not enough. There are only ${stockInfo.stock_quantity} left.`
                })
            }
        }

        next();
    } catch (error) {
        next(error);
    }

}

export default checkStock;