import express, { Application } from 'express';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { Product } from './entity/product.entity';
import { Order } from './entity/order.entity';
import { FreeProductPromotion } from './entity/freeProductPromotion.entity';
import { PercentageDiscountPromotion } from './entity/percentageDiscountPromotion.entity';
import { Category } from './entity/category.entity';
import indexRouter from './routes/index.router';
import errorHandler from './middlewares/errorHandler.middleware';
import { addPromotionsToRedis } from './helpers/redis/promotions.redis';
import { addStockQuantitiesToRedis } from './helpers/redis/stock.redis';
import { OrderItem } from './entity/orderItems.entity';

dotenv.config({ path: '../.env' });

const app: Application = express();
app.use(express.json());

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT!),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    synchronize: true,
    entities: [Product, Order, FreeProductPromotion, PercentageDiscountPromotion, Category, OrderItem],
});

AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!")
    
    // When the app is initialized, load the promotions to Redis
    await addPromotionsToRedis();
    await addStockQuantitiesToRedis();

}).catch((err) => {
    console.error("Error during Data Source initialization", err)
})


app.use('/api/v1', indexRouter);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});