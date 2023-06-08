import mongoose from "mongoose";

const schemaMessages = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
}, { versionKey: false })

const MessagesModel = db.model(collection, schemaMessages);

module.exports = MessagesModel;