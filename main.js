import express from "express"
import { engine } from "express-handlebars"
import { Server as SocketIOServer } from "socket.io"
import { apiRouter } from "./routers/apiRouter.js"
import { viewsRouter } from "./routers/viewsRouter.js"
import { ioManager } from "./controllers/mongoIoController.js"
import { connectMongo } from "./data/mongoose.js"


await connectMongo()
const express = require('express');
const app = express()
const PORT = 8080;

const server = app.listen(process.env.PORT || PORT, () => {
    Console.LOG('server listening on PORT ${PORT}');
});
app.use('/static', express.static('./static'))
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', viewsRouter)
app.use('/api', apiRouter)

app.use((error, req, res, next) => {
    switch (error.message) {
        case 'ID no existe':
            res.status(404)
            break
        case 'Falta un argumento':
            res.status(400)
            break
        case 'El codigo ingresado ya existe':
            res.status(400)
            break
        default:
            res.status(500)
    }
    res.json({ message: error.message })
})


class ProductManager {
    constructor() {
        this.products = [];
    }

    static id = 0;
}    

    addProduct(title, description, price, image, code, stock); {
        for (let i = 0; i < this.products.length; i++) {
            if(this.products[i].code === code){
                console.log('el codigo ${code} esta repetido');
                break;
            }
        } 
        const newProduct ={
            title,
            description,
            price,
            image,
            code,
            stock,
        }

       if(!Object.values(newProduct).includes(undefined)){
        ProductManager.id++;
        this.products.push({
            ...newProduct,
            id: ProductManager.id, 
        });
       } else{
        console.log('todos los campos son requeridos')
       }

    }


getProduct(); {
    return this.products;
}

existe (id); {
    return this.product.find((producto) => producto.id === id)
}

getProductById(id);{
 !this.existe(id) ? console.log('Not Found') : console.log(this.existe(id));
 }


 const productos = new ProductManager

 productos.addProduct('titulo1','descripcion1', '1000', 'imagen1', 'abc123', '5')
 productos.addProduct('titulo2','descripcion2', '1002', 'imagen2', 'abc124', '6')
 console.log(productos.getProduct())

productos.getProductById(2)

const Contenedor = require ('Archivos.js');

const products = new Contenedor('productos.txt');

const test = async () => {
    let  save = await products.save({
        title: 'Nico',
        price: 12345,
        thumbnail: 'https:asaaa123'
    });
    let getAll = await products.getAll();
    let getById = await products.getById(5);
    let deleteById = await products.deleteById(2);
    let deleteAll = await products.deleteAll
    console.log(save); 
    console.log(getAll); 
    console.log(getById); 
    console.log(deleteById); 
    console.log(deleteAll); 
};

test();

const { Console } = require('console');

const Contenedor = require('./archivos')


server.on('error', err => console.log('error: ${err}'));

app.get('/productos', async (req, res) => {
    const productos = await products.getAll();
    res.send(productos);
})

app.get('/productoRamdom', async (req,res) => {
    const productos = await products.getAll();
    let numeroRamdom = math.floor(math.ramdom()* productos.length);
    res.send(productos[numeroRamdom]);
});

export const io = new SocketIOServer(server)


ioManager(io)





