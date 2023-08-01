import { Router } from "express"
import { getCart, addCart, addProducts } from "../controllers/cartsControllerMongo.js"

export const cartsRouter = Router()


cartsRouter.get('/:cid', getCart)

cartsRouter.post('/', addCart)


cartsRouter.post('/:cid/product/:pid', addProducts)


cartsRouter.post('/:cid/product/:pid', addProducts)