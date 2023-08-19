const CustomErrorRepository = require("../DAO/repositories/errors.repository");

function adminAccess(req, res, next) {
  if (req.user.role === "administrador") {
    next();
  } else {
    next(new CustomErrorRepository(401));
  }
}

module.exports = adminAccess;
