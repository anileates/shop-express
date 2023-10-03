import zod from 'zod';

export const createFreeProductPromotionSchema = zod.object({
    promotion_name: zod
        .string({ required_error: 'Promotion name is required' })
        .min(5)
        .max(255, 'Promotion name must be less than 255 characters'),
    free_product_id: zod
        .number({ required_error: 'Product id is required' })
        .min(1, 'Product id must be positive'),
}).strict({ message: 'Invalid data' });