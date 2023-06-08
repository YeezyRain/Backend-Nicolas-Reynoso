import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schemaProducts = new mongoose.Schema({
    tittle: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: 'Otros' },
    price: { type: Number, required: true },
    thumbnail: { type: String },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
}, { versionKey: false })

schemaProducts.plugin(mongoosePaginate)

const productsModel = db.model(collection, schemaProducts);

module.exports = productsModel;