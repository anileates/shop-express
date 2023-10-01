import { In, Repository } from "typeorm";
import { CreateOrderDto, individualOrder } from "../dto/createOrder.dto";
import { Order } from "../entity/order.entity";
import { Product } from "../entity/product.entity";
import { applyMostProfitablePromotion, calculateShippingPrice, calculateSum } from "../helpers/order/order.helpers";
import { OrderItem } from "../entity/orderItems.entity";

export default class OrderService {
    constructor() {

    }

    public async createOrder(orderDto: CreateOrderDto): Promise<Order> {
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

            const savedOrder = await order.save();
            if (savedOrder) {
                const orderProducts = orderDto.products.map((product: individualOrder) => {
                    let orderProduct = new OrderItem();
                    orderProduct.order_id = savedOrder.order_id!
                    orderProduct.product_id = product.productId
                    orderProduct.quantity = product.quantity

                    return orderProduct
                });

                const orderProductRepository: Repository<OrderItem> = OrderItem.getRepository();
                orderProductRepository.save(orderProducts);
            }

            return savedOrder
        } catch (error) {
            throw error;
        }
    }

    public async getOrder(orderId: number) {
        try {
            const order = await Order.findOne({
                where: { order_id: orderId }, relations: {
                    products: {
                        category: true
                    }
                }
            });

            return order;
        } catch (error) {
            throw error;
        }
    }
}