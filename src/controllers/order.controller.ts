import { NextFunction, Request, Response } from 'express'
import { CreateOrderDto, individualOrder } from '../dto/createOrder.dto'
import { Order } from '../entity/order.entity';
import ProductService from '../services/product.service';
import OrderService from '../services/order.service';
import _ from 'lodash';

const orderService: OrderService = new OrderService();
const productService: ProductService = new ProductService();

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderDto: CreateOrderDto = req.body;

    try {
        const order: Order = await orderService.createOrder(orderDto);

        if (!order) {
            return res.status(500).json({
                message: 'Order could not be created'
            })
        }

        // Update the stock of the products
        orderDto.products.forEach(async (product: individualOrder) => {
            await productService.decreaseStock(product.productId, product.quantity);
        });

        return res.status(200).json({
            message: 'Order created successfully',
            order
        })
    } catch (error) {
        next(error)
    }
}

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
        let order = await orderService.getOrder(+id!);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Let's find the final price which is the sum of the order + shipping price - free product price or percentage discount
        let finalPrice = order.total_amount + order.shipping_price ;

        if(order.free_product_promotion) finalPrice -= order.free_product_promotion.product.list_price!
        else finalPrice -= order.percentage_discount_promotion?.discount_percentage! * order.total_amount / 100
        
        _.set(order, 'final_price', finalPrice)

        order = _.omit(order, ['free_product_promotion_id', 'percentage_discount_promotion_id'])

        return res.status(200).json({
             order
        })
    } catch (error) {

    }
}



export {
    createOrder,
    getOrder
}