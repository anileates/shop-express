import { DataSource } from 'typeorm';
import * as fs from 'fs';
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });


const seed = async (connection: DataSource, tableName: string, pathToFile: string) => {
    const rawdata = fs.readFileSync(pathToFile);
    const json = JSON.parse(rawdata.toString());

    try {
        await connection
        .createQueryBuilder()
        .insert()
        .into(tableName)
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

AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!")
    seed(AppDataSource, 'product', path.resolve(__dirname, 'products.json'))
})