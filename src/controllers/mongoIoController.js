import { messagesManager } from "../dao/models/messagesShema.js"
import { productsManager } from "../dao/models/productsShema.js"
import { Messages } from "../entities/messages.js"
import { Products } from "../entities/products.js"


export async function ioManager(io) {

    io.on('connection', async clientSocket => {
        console.log(`Nuevo cliente conectado! socket id# ${clientSocket.id}`)
        clientSocket.emit('updateProducts', await productsManager.getAll())



        clientSocket.on('newProduct', async product => {
            const productReq = new Products(product)
            console.log(productReq)
            await productsManager.addProduct(productReq.data())
            clientSocket.emit('updateProducts', await productsManager.getAll())
        })

        clientSocket.on('updateProduct', async product => {
            const productReq = new Products(product)
            await productsManager.updateByID(product._id, productReq.data())
            clientSocket.emit('updateProducts', await productsManager.getAll())
        })

        clientSocket.on('deleteProduct', async item => {
            await productsManager.deleteByID(item.id)
            clientSocket.emit('updateProducts', await productsManager.getAll())
        })

        clientSocket.emit('updateMessage', await messagesManager.getAll())
        clientSocket.on('newMessage', async message => {
            const messageReq = new Messages(message)
            await messagesManager.addMessage(messageReq.data())
            clientSocket.emit('updateMessage', await messagesManager.getAll())
        })

        clientSocket.on('newUser', async username => {
            clientSocket.broadcast.emit('newUser', username)
        })
    })
}

