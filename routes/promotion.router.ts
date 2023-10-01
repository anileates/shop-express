import { Router, Request, Response, NextFunction } from 'express';
import { requestValidator } from '../middlewares/dtoValidator.middleware';
import { createDiscountSchema } from '../dto/createPromotion.dto';
import { createFreeProductPromotionSchema } from '../dto/createFreeProduct.dto';
import { createDiscount, createFreeProductPromotion, getDiscounts, getFreeProductPromotions } from '../controllers/promotion.controller';

const router: Router = Router();

router.post('/discounts', requestValidator(createDiscountSchema), createDiscount);

router.post('/free-product-promotions', requestValidator(createFreeProductPromotionSchema), createFreeProductPromotion)

router.get('/discounts', getDiscounts)

router.get('/free-product-promotions', getFreeProductPromotions)

export default router;