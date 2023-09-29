import zod from 'zod';

export const createPromotionSchema = zod.object({
    promotion_name: zod
        .string({ required_error: 'Promotion name is required' })
        .min(5)
        .max(255, 'Promotion name must be less than 255 characters'),
    minimum_amount: zod
        .number()
        .min(0, 'Minimum amount must be greater than 0'),
    discount_percentage: zod
        .number()
        .min(0, 'Minimum percentage must be greater than 0')
        .max(100),
}).strict({ message: 'Invalid data' });