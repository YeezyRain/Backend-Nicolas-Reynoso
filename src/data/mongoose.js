import mongoose from 'mongoose'
import { productsManager } from '../dao/models/productsShema.js';

export async function connectMongo(params) {
    await mongoose.connect("mongodb+srv://reynosonicolas:RixNixxx28@backendnico.h7caf3w.mongodb.net/?retryWrites=true&w=majority")
    console.log(`Base de datos conectada.`)
}