import zod, { number } from 'zod';

const individualOrder = zod.object({
    productId: zod.number(),
    quantity: zod.number()
})

export const createOrderSchema = zod.object({
    customer_name: zod
        .string({ required_error: 'Customer name is required' })
        .min(5, 'Customer name must be greater than 5 characters')
        .max(30, 'Customer name must be less than 30 characters'),
    products: zod
        .array(individualOrder)
}).strict({ message: 'Invalid data' });


export type individualOrder = zod.infer<typeof individualOrder>;
export type CreateOrderDto = zod.infer<typeof createOrderSchema>;