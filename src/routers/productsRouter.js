import { Router } from "express"
import { getProducts, getProduct, addProduct , putProduct, deleteProduct} from "../controllers/productsControllerFs.js"

export const productsRouter = Router()


productsRouter.get('/', getProducts)


productsRouter.get('/:pid', getProduct)


productsRouter.post('/', addProduct)


productsRouter.put('/:pid', putProduct)


productsRouter.delete('/:pid', deleteProduct)
