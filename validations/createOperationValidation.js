const { check } = require("express-validator");

const createOperationValidation = [
  check("motivo", "El campo motivo no puede estar vacio").notEmpty(),
  check(
    "tipoOperacion",
    "El campo tipoOperacion no puede estar vacio"
  ).notEmpty(),
  check("monto", "El campo monto no puede estar vacio").notEmpty(),
  check("monto", "El campo monto no puede ser negativo").isInt({ min: 0 }),
];

module.exports = createOperationValidation;
