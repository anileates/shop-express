type CachedFreeProductPromotion = {
    promotion_id: number;
    free_product_id: string;
    quantity: number;
    promotion_name: string;
}

type CachedDiscountPromotion = {
    promotion_id: number;
    promotion_name: string;
    discount_percentage: number;
    minimum_amount: number;
}

type CachedStockQuantity = {
   product_id: number;
   stock_quantity: number; 
}

export {
    CachedFreeProductPromotion,
    CachedStockQuantity,
    CachedDiscountPromotion
}