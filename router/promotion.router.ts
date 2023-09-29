import { Router, Request, Response, NextFunction } from 'express';
import { requestValidator } from '../middlewares/dtoValidator.middleware';
import { createPromotionSchema } from '../dto/createPromotion.dto';
import { createFreeProductPromotionSchema } from '../dto/createFreeProduct.dto';
import { createDiscount, createFreeProductPromotion } from '../controllers/promotion.controller';

const router: Router = Router();

router.post('/create-discount', requestValidator(createPromotionSchema), createDiscount);

router.post('/create-free-product-promotion', requestValidator(createFreeProductPromotionSchema), createFreeProductPromotion)

export default router;