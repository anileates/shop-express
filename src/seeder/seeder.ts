import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as _ from 'lodash';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

 const seed = async (connection: DataSource, pathToFile: string) => {
    console.log(pathToFile)

    const rawdata = fs.readFileSync(pathToFile);
    const json = JSON.parse(rawdata.toString());

    // Extract all the categories and make it unique
    const categories = _.uniqBy(json.map((item: any) => {
        return {
            category_id: item.category_id,
            category_title: item.category_title
        }
    }), 'category_id');


    // Remove category_title from the json
    json.forEach((item: any) => {
        delete item.category_title;
    })

    try {
        // Insert categories first
        await connection
            .createQueryBuilder()
            .insert()
            .into('category')
            .values(categories)
            .execute();

        // Insert products
        await connection
            .createQueryBuilder()
            .insert()
            .into('product')
            .values(json)
            .execute();

        console.log('✅ Data has been seeded!')
    } catch (error) {
        console.log('❌ Error seeding data!', error)
    }
}

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT!),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME
});

export {
    seed
}