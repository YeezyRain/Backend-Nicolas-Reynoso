import { Router } from "express"

export const cartsRouter = Router()

//GET cart by id
cartsRouter.get('/:cid', getCart)

//GET cart by id
cartsRouter.post('/', addCart)

//Add product
cartsRouter.post('/:cid/product/:pid', addProducts)

//Add product
cartsRouter.post('/:cid/product/:pid', addProducts)