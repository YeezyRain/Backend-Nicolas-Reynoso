const { Router } = require("express");
const passport = require("passport");
const logger = require("../config/logger.config");
const Users = require("../models/Users.model");
const ErrorRepository = require("../DAO/repositories/errors.repository");
const ResetPasswordRepository = require("../DAO/repositories/resetPassword.repository");

const router = Router();

router.get("/", (req, res, next) => {
  try {
    res.render("login.handlebars");
  } catch (error) {
    next(error);
  }
});

router.get("/forgot-password-email", (req, res, next) => {
  try {
    res.render("forgotPasswordEmail.handlebars");
  } catch (error) {
    next(error);
  }
});

router.get("/forgot-password/:email", (req, res, next) => {
  try {
    const email = req.params.email;

    res.render("resetPassword.handlebars", { email });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password-email", async (req, res, next) => {
  try {
    const email = req.body.email;

    const session = await Users.findOne({ email: email });

    if (!session) {
      throw new ErrorRepository(
        "Usuario no encontrado, verifica tu correo electronico",
        404
      );
    }

    const resetPasswordRepository = new ResetPasswordRepository();
    const createToken = await resetPasswordRepository.createToken(email, res);

    res.json({ message: "token sent successfully", toke: createToken });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password/:email", async (req, res, next) => {
  const newPassword = req.body.newPassword;
  const token = req.cookies.resetToken;
  const email = req.params.email;

  try {
    const resetPasswordRepository = new ResetPasswordRepository();
    await resetPasswordRepository.resetPassword(newPassword, token, email);

    res.status(200).json({ message: "Contraseña cambiada con exito" });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  passport.authenticate("login", { failureRedirect: "login/faillogin" }),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ErrorRepository("Usuario o contraseña incorrectos", 404);
      }

      req.session.user = req.user;

      const now = new Date();
      await Users.findByIdAndUpdate(req.session.user._id, {
        last_conection: now,
      });

      req.session.save();
      logger.info("Se inicio una sesion con exito", req.session.user);
      res.status(200).json({ status: "succes", message: "sesion establecida" });
    } catch (error) {
      console.log(error);
      logger.error("Error al iniciar sesion", error);
      next(error);
    }
  }
);

router.get("/logout", async (req, res, next) => {
  const now = new Date();
  await Users.findByIdAndUpdate(req.user._id, { last_conection: now });

  req.session.destroy((error) => {
    if (error) {
      logger.error("Error al cerrar la sesion", error);
      return next(error);
    }
    res.redirect("/api/login");
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "login/faillogin" }),
  async (req, res) => {
    const now = new Date();
    await Users.findByIdAndUpdate(req.user._id, { last_conection: now });

    req.session.user = req.user;
    req.session.save();
    res.redirect("/api/dbProducts?limit=9");
  }
);

router.get("/faillogin", (req, res, next) => {
  logger.error("Error al iniciar session, verifica tus datos.");
  throw new ErrorRepository(
    "Error al iniciar session, verifica tus datos.",
    500
  );
});
module.exports = router;
