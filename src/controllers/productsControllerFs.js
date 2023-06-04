import { ProductManager } from "../dao/managers/productManager.js"
export const productManager = new ProductManager('./src/data/productos.json')

export async function getProducts(req, res,next) {
    try {
        let products = await productManager.getProducts()
        req.query.limit && (products = products.slice(0,req.query.limit))
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

export async function getProduct(req, res,next) {
    try {
        const {pid} = req.params
        const product = await productManager.getProductById(pid)
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

export async function addProduct(req, res,next) {
    try {
        await productManager.addProduct(req.body)
        res.status(201).json({message: 'Producto agregado'})
    } catch (error) {
        next(error)
    }
}

export async function putProduct(req, res,next) {
    try {
        await productManager.updateProduct(req.params.pid, req.body)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}

export async function deleteProduct(req, res,next) {
    try {
        await productManager.deleteProduct(req.params.pid)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}