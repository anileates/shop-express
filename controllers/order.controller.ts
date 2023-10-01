import { NextFunction, Request, Response } from 'express'
import { CreateOrderDto, individualOrder } from '../dto/createOrder.dto'
import { Order } from '../entity/order.entity';
import ProductService from '../services/product.service';
import OrderService from '../services/order.service';

const orderService: OrderService = new OrderService();
const productService: ProductService = new ProductService();

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderDto: CreateOrderDto = req.body;

    try {
        const order: Order = await orderService.createOrder(orderDto);

        if(!order) {
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




export {
    createOrder
}