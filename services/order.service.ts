import { In } from "typeorm";
import { CreateOrderDto, individualOrder } from "../dto/createOrder.dto";
import { Order } from "../entity/order.entity";
import { Product } from "../entity/product.entity";
import { applyMostProfitablePromotion, calculateShippingPrice, calculateSum } from "../helpers/order/order.helpers";

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

            return await order.save();
        } catch (error) {
            throw error;
        }
    }
}