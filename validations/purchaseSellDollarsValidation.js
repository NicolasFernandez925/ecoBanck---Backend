const { check } = require("express-validator");

const purchaseSellDollarsValidation = [
  check("cantidad", "El campo cantidad no puede estar vacio").notEmpty(),
  check("motivo", "El campo motivo no puede estar vacio").notEmpty(),
  check("concepto", "El campo concepto no puede estar vacio").notEmpty(),
  check("cantidad", "El campo cantidad no puede ser negativo").isInt({
    min: 0,
  }),
];

module.exports = purchaseSellDollarsValidation;
