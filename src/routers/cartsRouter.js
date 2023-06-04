import { Router } from "express"

export const cartsRouter = Router()


cartsRouter.get('/:cid', getCart)

cartsRouter.post('/', addCart)


cartsRouter.post('/:cid/product/:pid', addProducts)


cartsRouter.post('/:cid/product/:pid', addProducts)