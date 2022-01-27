"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const md5_1 = require("ts-md5/dist/md5");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const path = './product.json';
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/getProducts', (req, res) => {
    if (fs_1.default.existsSync(path)) {
        fs_1.default.readFile('./product.json', 'utf-8', (err, jsonString) => {
            product = JSON.parse(jsonString);
            res.json(product);
        });
    }
    else {
        res.status(200).json({ "message": 'No data products present' });
    }
});
let product = [];
app.post('/addProduct', (req, res) => {
    const newProduct = {
        product_id: md5_1.Md5.hashStr(String(new Date())),
        product_name: req.body.name,
        product_price: req.body.price,
        product_desc: req.body.description,
        product_image: req.body.image,
    };
    product.push(newProduct);
    try {
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.writeFile('./product.json', JSON.stringify(product), err => {
                if (err)
                    res.status(400).send({ "error": err });
                else
                    res.send({ "message": "data added successfully" });
            });
        }
        else {
            fs_1.default.readFile('./product.json', 'utf-8', (err, jsonString) => {
                product = JSON.parse(jsonString);
                product.push(newProduct);
                fs_1.default.writeFile('./product.json', JSON.stringify(product), err => {
                    if (err)
                        res.status(400).send({ "error": err });
                    else
                        res.send({ "message": "data added successfully" });
                });
            });
        }
    }
    catch (error) {
        console.log('Error', error);
    }
});
app.get('/', (req, res) => {
    res.send('Welcome to our page, Happy shopping!');
});
app.listen(port, () => {
    console.log('server started');
});
