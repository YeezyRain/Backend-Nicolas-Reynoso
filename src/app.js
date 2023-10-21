const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoConnect = require("../db");
const router = require("./router");
const passport = require("passport");
const initializePassport = require("./config/passport.config");
const logger = require("./config/logger.config");
const swaggerUiExpress = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

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

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const {dbAdmin, dbHost, dbPassword, dbName, dbSecretKey} = require('../src/config/db.config')

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://${dbAdmin}:${dbPassword}@${dbName}.${dbHost}/?retryWrites=true&w=majority',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      collectionName: "sessions",
    }),
    secret: `${dbSecretKey}`,
    resave: false,
    saveUninitialized: false,
  })
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "My project API",
      description:
        "Endpoints to Manager Products and carts in my ecommerce aplication.",
    },
  },
  apis: [`${__dirname.replace(/\\/g, "/")}/docs/**/*.yaml`],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpecs)
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

mongoConnect();
router(app);

module.exports = app;