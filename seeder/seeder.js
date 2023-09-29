"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var fs = require("fs");
var _ = require("lodash");
var path = require('path');
var dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
var seed = function (connection, pathToFile) { return __awaiter(void 0, void 0, void 0, function () {
    var rawdata, json, categories, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rawdata = fs.readFileSync(pathToFile);
                json = JSON.parse(rawdata.toString());
                categories = _.uniqBy(json.map(function (item) {
                    return {
                        category_id: item.category_id,
                        category_title: item.category_title
                    };
                }), 'category_id');
                // Remove category_title from the json
                json.forEach(function (item) {
                    delete item.category_title;
                });
                console.log(json, categories);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                // Insert categories first
                return [4 /*yield*/, connection
                        .createQueryBuilder()
                        .insert()
                        .into('category')
                        .values(categories)
                        .execute()];
            case 2:
                // Insert categories first
                _a.sent();
                // Insert products
                return [4 /*yield*/, connection
                        .createQueryBuilder()
                        .insert()
                        .into('product')
                        .values(json)
                        .execute()];
            case 3:
                // Insert products
                _a.sent();
                console.log('✅ Data has been seeded!');
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log('❌ Error seeding data!', error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME
});
AppDataSource.initialize().then(function () {
    console.log("Data Source has been initialized!");
    seed(AppDataSource, path.resolve(__dirname, 'products.json'));
});
