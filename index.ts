import express, { Application } from 'express';
import { DataSource } from 'typeorm';
import { Product } from './entity/product.entity';
import { Order } from './entity/order.entity';
import { FreeProductPromotion } from './entity/freeProductPromotion.entity';
import { PercentageDiscountPromotion } from './entity/percentageDiscountPromotion.entity';
import { OrderProduct } from './entity/orderProduct.entity';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const app: Application = express();

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT!),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    synchronize: true,
    entities: [Product, Order, FreeProductPromotion, PercentageDiscountPromotion, OrderProduct],
});

AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!")
}).catch((err) => {
    console.error("Error during Data Source initialization", err)
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});