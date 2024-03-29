const { Router } = require("express");
const router = Router();
const UserDTO = require("../DAO/DTO/users.dto");
const moment = require("moment");
const userDao = require("../DAO/users.dao");
const ErrorRepository = require("../DAO/repositories/errors.repository");
const logger = require("../config/logger.config");
const Users = require("../models/Users.model");
const path = require("path");
const multerUpload = require("../utils/multer.utils.js");
const mailerDao = require("../DAO/mailer.dao");
const adminAccess = require("../middlewares/adminAccess.middleware");

router.get("/", async (req, res, next) => {
  try {
    const users = await Users.find();
    const userDTOs = users.map((user) => new UserDTO(user));

    res.status(200).json(userDTOs);
  } catch (error) {
    next(error);
  }
});

router.get("/session/current", (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      const user = req.session.user;
      const userDto = new UserDTO(user);
      return res.status(200).json(userDto);
    }
    next(new ErrorRepository(404));
  } catch (error) {
    next(error);
  }
});

router.get("/premium/:uid", async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await Users.findById(userId);

    if (user.role === "administrador") {
      throw new ErrorRepository("Error, rol no autorizado", 401);
    }

    const requiredDocuments = ["product", "profile", "document"];
    const userDocuments = user.document.map((doc) =>
      path.basename(doc.name, path.extname(doc.name))
    );

    const hasAllRequiredDocuments = requiredDocuments.every((doc) =>
      userDocuments.includes(doc)
    );

    if (!hasAllRequiredDocuments) {
      throw new Error(
        "El usuario debe cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta"
      );
    }

    const changeRole = await userDao.changeUserRole(user);

    logger.info("se cambio el rol del usuario actual", changeRole);
    res.json({ user: changeRole });
  } catch (error) {
    logger.error("Error al cambiar el rol del usuario", error);
    next(error);
  }
});

router.post("/:uid/documents", multerUpload.any(), async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await Users.findById(userId);
    const uploadedDocuments = req.files.map((file) => ({
      name: file.originalname,
      reference: file.filename,
    }));
    user.document.push(...uploadedDocuments);
    await user.save();
    res.json({ message: "Documentos cargados exitosamente." });
  } catch (error) {
    console.error("Error al cargar documentos:", error);
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const inactiveThreshold = moment().subtract(30, "minutes");

    const inactiveUsers = await Users.find({
      last_conection: { $lt: inactiveThreshold.toISOString() },
    });

    for (const user of inactiveUsers) {
      const mailOptions = {
        from: "Administrador del ecommerce",
        to: user.email,
        subject: "Cuenta inactiva",
        text: "El equipo de ecommerce ha decidido eliminar tu cuenta debito a la inactividad de la misma.",
      };

      await mailerDao.sendMail(mailOptions);

      await Users.deleteOne(user);
    }

    res.status(201).json({ message: "Cuentas eliminadas por inactividad" });
  } catch (error) {
    next(error);
  }
});

router.get("/deleteUser/:uid", adminAccess, async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await Users.findOne({ _id: userId });
    await Users.deleteOne({ _id: userId });

    res.status(201).json({ message: `Usuario ${user.email} eliminado` });
  } catch (error) {
    next(error);
  }
});

router.get("/changeRole/:uid", adminAccess, async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await Users.findById(userId);

    if (user.role === "administrador") {
      throw new ErrorRepository("Error, rol no autorizado", 401);
    }

    const changeRole = await userDao.changeUserRole(user);
    res.status(200).json({ user: changeRole });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
