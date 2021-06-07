const { check } = require("express-validator");

module.exports = function (req, res, next) {
  [
    check("email", "El email no puede estar vacio").notEmpty(),
    check("email", "Agrega un email válido").isEmail().normalizeEmail(),
    check("password", "El campo password no puede estar vacio")
      .trim()
      .notEmpty(),
    check("password", "El password debe ser minimo de 2 caracteres")
      .trim()
      .isLength({
        min: 2,
      }),
  ],
    next();
};
