const { check } = require("express-validator");

module.exports = function (req, res, next) {
  [
    check("email", "Agrega un email válido").isEmail().notEmpty(),
    check("nombre", "Agrega un nombre").notEmpty(),
    check("apellido", "Agrega un apellido").notEmpty(),
    check("password", "Debe tener almenos 6 caracteres").trim().isLength({
      min: 6,
    }),
  ],
    next();
};
