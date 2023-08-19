const express = require("express");
const app = express();
const router = require("./router");
const mongoConnect = require("../db");
const MongoStore = require("connect-mongo");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoConnect();
router(app);

module.exports = app;