const { check } = require("express-validator");

const loginUserValidation = [
  check("email", "Agrega un email válido").isEmail().notEmpty(),
  check("password", "El campo password no puede estar vacio").notEmpty(),
  check("password", "El password debe ser minimo de 2 caracteres").isLength({
    min: 2,
  }),
];

module.exports = loginUserValidation;
