import express from "express"
import { engine } from "express-handlebars"
import { Server as SocketIOServer } from "socket.io"
import { apiRouter } from "./src/routers/apiRouter.js"
import { viewsRouter } from "./src/routers/viewsRouter.js"
import { ioManager } from "./src/controllers/mongoIoController.js"
import { connectMongo } from "./src/data/mongoose.js"


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

export const io = new SocketIOServer(server)


ioManager(io)





