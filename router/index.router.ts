import { Router } from 'express';
import promotionRouter from './promotion.router';

const router = Router();

router.use('/promotions', promotionRouter);

export default router;
