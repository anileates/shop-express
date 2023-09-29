import { Request, Response, NextFunction, RequestHandler } from 'express';
import zod, { AnyZodObject, ZodSchema } from 'zod';

export const requestValidator = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body)
            next();
        } catch (error) {
            return res.status(400).json(error);
        }
    };