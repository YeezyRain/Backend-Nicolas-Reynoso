const express = require("express");
const app = express();
const router = require("./router");
const mongoConnect = require("../db");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const hbs = handlebars.create({
  handlebars: allowInsecurePrototypeAccess(require("handlebars")),
  defaultLayout: "main",
});
app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoConnect();
router(app);

module.exports = app;