import mongoose from "mongoose";
import { productsManager } from "./productsShema.js";
import { io } from "../../../main.js";

const schemaCarts = new mongoose.Schema({
    products: { type: Object, required: true }
}, { versionKey: false })

const CartsModel = db.model(collection, schemaCarts);

module.exports = CartsModel;