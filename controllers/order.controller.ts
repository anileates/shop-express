import { NextFunction, Request, Response } from 'express'
import { CreateOrderDto, individualOrder } from '../dto/createOrder.dto'
import { Product } from '../entity/product.entity';
import { In } from 'typeorm';
import { Order } from '../entity/order.entity';
import { getDiscountPromotion, calculateShippingPrice, calculateSum, getApplicableFreeProductPromotions, applyMostProfitablePromotion, decreaseProductStocks } from '../service/order.service';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderDto: CreateOrderDto = req.body;

    try {
        const purchasedProductIds = orderDto.products.map((product: individualOrder) => product.productId);
        const products = await Product.find({ where: { product_id: In(purchasedProductIds) } });
        
        let order = new Order();
        order.customer_name = orderDto.customer_name;
        order.products = products;

        const sum = calculateSum(products, orderDto.products);
        order.total_amount = sum;

        order.shipping_price = calculateShippingPrice(sum);

        order = await applyMostProfitablePromotion(order);

        await order.save();

        await decreaseProductStocks(products, orderDto.products);

        return res.status(200).json({
            message: 'Order created successfully',
            sum,
            order
        })
    } catch (error) {
        next(error)
    }
}




export {
    createOrder
}