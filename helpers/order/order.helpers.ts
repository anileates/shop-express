import { individualOrder } from "../../dto/createOrder.dto";
import { FreeProductPromotion } from "../../entity/freeProductPromotion.entity";
import { Order } from "../../entity/order.entity";
import { PercentageDiscountPromotion } from "../../entity/percentageDiscountPromotion.entity";
import { Product } from "../../entity/product.entity";
import { getDiscountsFromRedis } from "../redis/promotions.redis";
import { getRedisClient } from "../redis/redis.helper";

/**
 * @description Calculate the sum of the order
 * 
 * @param products Array of product entities. It is used to find the list price of the product.
 * @param purchasedItems Array of individualOrder DTOs. It is used to find the quantity of the products.
 */
const calculateSum = (products: Product[], purchasedItems: individualOrder[]): number => {
    // Calculate the sum
    const sum = products.reduce((total: number, product: Product) => {
        // Find how many times the product is ordered
        const quantity = purchasedItems.find((p: individualOrder) => p.productId === product.product_id)?.quantity;
        return total + (product.list_price * quantity!);
    }, 0);

    return sum;
}

/**
 * @param sum Sum of the order
 */
const calculateShippingPrice = (sum: number): number => {
    return sum > 150 ? 0 : 35; // Shipping price and condition might be dynamic
}

/**
 * @private
 * @description Find the applicable discount of the order
 * 
 * @param sum Sum of the order
 * @return The most applicable discount promotion - PercentageDiscountPromotion
 */
const getDiscountPromotion = async (sum: number): Promise<PercentageDiscountPromotion> => {
    const discounts = await getDiscountsFromRedis();
    const applicableDiscounts =
        discounts?.filter((discount: PercentageDiscountPromotion) => discount.minimum_amount < sum)
    const largestDiscount = applicableDiscounts?.sort((a, b) => b.minimum_amount - a.minimum_amount)[0];

    return largestDiscount;
}

/**
 * @private 
 * @param products A list of product entities that are purchased
 * @returns An object that contains the most expensive product and the promotion that is applicable to that product
 */
const getApplicableFreeProductPromotions = async (products: Product[]) => {
    const productIds = products.map((product: Product) => product.product_id!);

    let applicableFreeProductPromotions: FreeProductPromotion[] = [];
    await Promise.all(
        productIds.map(async (productId: number) => {
            const freeProduct = await getRedisClient().then(redisClient => redisClient.get(`freeProduct:${productId}`));
            if (freeProduct) applicableFreeProductPromotions.push(JSON.parse(freeProduct!));
        })
    );

    // Find the most expensive product from the purchased products and decide the promotion
    let productToApply: Product | undefined = undefined;
    let freeProductPromotion: FreeProductPromotion | undefined = undefined;

    if (applicableFreeProductPromotions.length > 0) {
        const availableProducts = products.filter((product: Product) =>
            applicableFreeProductPromotions.find((freeProductPromotion: FreeProductPromotion) => freeProductPromotion.free_product_id === product.product_id))

        productToApply = availableProducts.reduce((expensive: Product, current: Product) => (current.list_price > expensive.list_price ? current : expensive));

        freeProductPromotion = applicableFreeProductPromotions.find((freeProductPromotion: FreeProductPromotion) => freeProductPromotion.free_product_id === productToApply?.product_id)
    }

    return { productToApply, freeProductPromotion };
}

/**
 * @public
 * @description Apply the most profitable promotion to the order. If there is no promotion, return the order as it is.
 * @param finalOrder 
 * @returns The order with the most profitable promotion applied
 */
const applyMostProfitablePromotion = async (finalOrder: Order): Promise<Order> => {
    const sum = finalOrder.total_amount;

    const { productToApply, freeProductPromotion } = await getApplicableFreeProductPromotions(finalOrder.products!);

    const applicableDiscount: PercentageDiscountPromotion = await getDiscountPromotion(sum);
    const discountAmount = sum * (applicableDiscount?.discount_percentage / 100);

    if (applicableDiscount && freeProductPromotion) {
        if (discountAmount >= productToApply!.list_price) {
            finalOrder.percentage_discount_promotion_id = applicableDiscount.promotion_id!;
        } else {
            finalOrder.free_product_promotion_id = freeProductPromotion!.promotion_id!;
        }
    } else if (applicableDiscount) {
        finalOrder.percentage_discount_promotion_id = applicableDiscount.promotion_id!;
    } else if (freeProductPromotion) {
        finalOrder.free_product_promotion_id = freeProductPromotion!.promotion_id!;
    }

    return finalOrder;
}

export { calculateSum, calculateShippingPrice, applyMostProfitablePromotion }