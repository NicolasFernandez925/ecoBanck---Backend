const express = require("express");
const router = express.Router();
const operacionesController = require("../controllers/operacionesController");
const auth = require("../middelwares/authMiddelware");
const createOperationValidation = require("../validations/createOperationValidation");

// =============== api/operaciones ================= //
router.get("/", auth, operacionesController.operaciones);

// =============== api/operaciones/createOperation ================= //
router.post(
  "/createOperation",
  createOperationValidation,
  auth,
  operacionesController.createOperation
);

// =============== api/operaciones/getBalance ================= //
router.get("/getBalance/", auth, operacionesController.balance);

// =============== api/operaciones/editOperation ================= //
router.patch(
  "/editOperation/:idOperation",
  auth,
  operacionesController.editOperation
);

// =============== api/operaciones/deleteOperation ================= //
router.delete(
  "/deleteOperation/:idOperation",
  auth,
  operacionesController.deleteOperation
);

module.exports = router;
