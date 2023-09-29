import { NextFunction, Request, Response } from 'express'
import { PercentageDiscountPromotion } from '../entity/percentageDiscountPromotion.entity'
import { FreeProductPromotion } from '../entity/freeProductPromotion.entity';
import { Product } from '../entity/product.entity';
import CustomError from '../helpers/customError';

const createDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promotion = new PercentageDiscountPromotion(req.body);

        const saved = await promotion.save();

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

        const promotion = new FreeProductPromotion(req.body);
        await promotion.save();

        return res.status(201).json({
            message: "Promotion created succesfully!",
            promotion
        });
    } catch (error) {
        next(error)
    }
}

export { createDiscount, createFreeProductPromotion }