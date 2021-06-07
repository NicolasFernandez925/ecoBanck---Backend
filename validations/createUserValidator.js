const { check } = require("express-validator");

const createUserValidator = [
  check("email", "Agrega un email válido").isEmail().notEmpty(),
  check("name", "Agrega un nombre").notEmpty(),
  check("surname", "Agrega un apellido").notEmpty(),
  check("password", "Debe tener almenos 6 caracteres").isLength({
    min: 6,
  }),
];

module.exports = createUserValidator;
