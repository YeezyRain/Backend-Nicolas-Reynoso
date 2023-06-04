import fs from "fs/promises"

export class ProductManager {
    constructor(path) {
        this.path = path
    }
    async getProducts() {
        let data = await fs.readFile(this.path)
        let products = JSON.parse(data)
        return products
    }

    async getProductById(id) {
        const arrayProducts = await this.getProducts()
        const product = arrayProducts.filter(item => item.id === parseInt(id))
        if (product.length === 0) throw new Error('ID no existe')
        return product
    }

    async saveProducts(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 4), 'utf8')
    }

    async addProduct(object) {
        object.status = true
        !object.thumbnail && (object.thumbnail = 'Sin imagen')
        if (!Object.values(object).every(value => value != '')) throw new Error('Falta un argumento')
        const arrayProducts = await this.getProducts()
        const result = arrayProducts.find(item => item.code === object.code)
        if (result) throw new Error('El codigo ingresado ya existe')
        arrayProducts.length === 0 ? object.id = 1 : object.id = arrayProducts[arrayProducts.length - 1].id + 1
        arrayProducts.push(object)
        await this.saveProducts(arrayProducts)
        console.log('Producto añadido')
    }

    async updateProduct(id, object) {
        const arrayProducts = await this.getProducts()
        const product = arrayProducts.filter(item => item.id === parseInt(id))
        const idx = arrayProducts.indexOf(...product)
        if (product.length === 0) throw new Error('ID no existe')
        const newProduct = {
            id: parseInt(id), ...object
        }
        arrayProducts[idx] = newProduct
        await this.saveProducts(arrayProducts)
        console.log('Producto actualizado')
    }

    async deleteProduct(id) {
        const arrayProducts = await this.getProducts()
        const product = arrayProducts.filter(item => item.id === parseInt(id))
        if (product.length === 0) throw Error('ID no existe')
        const newArray = arrayProducts.filter(item => item.id !== parseInt(id))
        await this.saveProducts(newArray)
        console.log('Producto eliminado')
    }
}
