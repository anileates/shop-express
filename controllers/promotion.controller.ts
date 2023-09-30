import { NextFunction, Request, Response } from 'express'
import { PercentageDiscountPromotion } from '../entity/percentageDiscountPromotion.entity'
import { FreeProductPromotion } from '../entity/freeProductPromotion.entity';
import { Product } from '../entity/product.entity';
import CustomError from '../helpers/customError';
import { addDiscountToRedis, addFreeProductPromotionToRedis, getDiscountsFromRedis, getFreeProductPromotionsFromRedis } from '../helpers/redis/promotions.redis';

const createDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const percentageDiscount = new PercentageDiscountPromotion();
        percentageDiscount.build(req.body);

        const saved = await percentageDiscount.save();

        // Add the new discount to Redis
        await addDiscountToRedis(saved);
        
        return res.status(201).json(saved);
    } catch (error) {
        next(error)
    }
}

const createFreeProductPromotion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find the product first
        const product = await Product.findOne({ where: { product_id: req.body.free_product_id } });
        
        if (!product) {
            return next(new CustomError('Product not found!', 404));
        }

        const promotion = new FreeProductPromotion();
        promotion.build(req.body);

        await promotion.save();

        // Add the new free product promotion to Redis
        await addFreeProductPromotionToRedis(promotion);

        return res.status(201).json({
            message: "Promotion created succesfully!",
            promotion
        });
    } catch (error) {
        next(error)
    }
}

const getDiscounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get discount from Redis
        const activeDiscounts = await getDiscountsFromRedis();

        return res.status(200).json(activeDiscounts);
    } catch (error) {
        next(error)
    }
}

const getFreeProductPromotions = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // Get free product promotions from Redis
        const promotions = await getFreeProductPromotionsFromRedis();

        return res.status(200).json(promotions);
    } catch (error) {
        next(error)
    }
}

export { createDiscount, createFreeProductPromotion, getDiscounts, getFreeProductPromotions }