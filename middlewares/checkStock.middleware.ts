import { Request, Response, NextFunction } from "express"
import { CreateOrderDto, individualOrder } from "../dto/createOrder.dto";
import { getStockFromRedis } from "../helpers/redis/stock.redis";
import { Product } from "../entity/product.entity";

const checkStock = async (req: Request, res: Response, next: NextFunction) => {
    const order: CreateOrderDto = req.body;

    try {
        for (const product of order.products) {
            const stockInfo: Product = await getStockFromRedis(product.productId).then((stock) => { if (stock) return JSON.parse(stock!) });

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