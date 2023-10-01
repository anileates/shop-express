import { Router } from 'express';
import promotionRouter from './promotion.router';
import orderRouter from './order.router';

const router = Router();

router.use('/promotions', promotionRouter);
router.use('/orders', orderRouter);

export default router;
