import express, { Application, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { Md5 } from 'ts-md5/dist/md5';

const app: Application = express();

const port: string | number = process.env.PORT || 5000;

const path: string = './product.json';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.get('/getProducts', (req: Request, res: Response) => {
    if (fs.existsSync(path)) {
        fs.readFile('./product.json', 'utf-8', (err, jsonString: string) => {
            product = JSON.parse(jsonString);
            res.json(product);
        })
    } else {
        res.status(200).json({"message": 'No data products present'});
    }
});

let product: Array<Object> = [];

app.post('/addProduct', (req: Request, res: Response) => {
    const newProduct = {
        product_id: Md5.hashStr(String(new Date())),
        product_name: req.body.name,
        product_price: req.body.price,
        product_desc: req.body.description,
        product_image: req.body.image,
    }
    product.push(newProduct);
    try {
        if (!fs.existsSync(path)) {
            fs.writeFile('./product.json', JSON.stringify(product), err => {
                if (err) res.status(400).send({ "error": err });
                else res.send({ "message": "data added successfully" });
            })
        } else {
            fs.readFile('./product.json', 'utf-8', (err, jsonString: string) => {
                product = JSON.parse(jsonString);
                product.push(newProduct);
                fs.writeFile('./product.json', JSON.stringify(product), err => {
                    if (err) res.status(400).send({ "error": err });
                    else res.send({ "message": "data added successfully" });
                })
            })
        }
    } catch (error) {
        console.log('Error', error);
    }

});

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to our page, Happy shopping!')
})

app.listen(port, () => {
    console.log('server started');
})
