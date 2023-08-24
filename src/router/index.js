const productsController = require("../Controller/controller.products");
const cartController = require("../Controller/controller.carts");
const registerController = require("../Controller/controller.register");
const authController = require("../Controller/controller.auth");
const userController = require("../Controller/controller.users");
const messagesController = require("../Controller/controller.messages");
const loggerTest = require("../Controller/constroller.loggerTest");
const ErrorRepository = require("../repositories/errors.repository");
const adminPanel = require("../Controller/controller.adminPanel");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorRepository) {
    const errorMessage = err.message || "Error desconocido";
    res.status(err.code).json({ error: errorMessage });
  } else {
    console.error(err);
    res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
};

const router = (app) => {
  app.use("/api/register", registerController);
  app.use("/api/login", authController);
  app.use("/api/dbProducts", productsController);
  app.use("/api/dbCarts", cartController);
  app.use("/api/user", userController);
  app.use("/api/messages", messagesController);
  app.use("/api/loggerTest", loggerTest);
  app.use("/api/adminPanel", adminPanel);
  app.use(errorHandler);
};

module.exports = router;
