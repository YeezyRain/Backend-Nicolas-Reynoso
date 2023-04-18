const { Console } = require('console');
const express = require('express');
const Contenedor = require('./archivos')
const app = express();
const PORT = 8080;

const server = app.listen(process.env.PORT || PORT, () => {
    Console.LOG('server listening on PORT ${PORT}');
});

server.on('error', err => console.log('error: ${err}'));

const products = new Contenedor('productos.txt');

app.get('/productos', async (req, res) => {
    const productos = await products.getAll();
    res.send(productos);
})

app.get('/productoRamdom', async (req,res) => {
    const productos = await products.getAll();
    let numeroRamdom = math.floor(math.ramdom()* productos.length);
    res.send(productos[numeroRamdom]);
});
