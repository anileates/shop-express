import { Router } from "express";
import { createOrder, getOrder } from "../controllers/order.controller";
import { requestValidator } from "../middlewares/dtoValidator.middleware";
import { createOrderSchema } from "../dto/createOrder.dto";
import checkStock from "../middlewares/checkStock.middleware";

const router: Router = Router();

router.post('/', requestValidator(createOrderSchema), checkStock, createOrder);
router.get('/:id', getOrder);

export default router;