var express = require("express");
var router = express.Router();
const auth = require("../middelwares/authMiddelware");
const authController = require("../controllers/authController");
const loginUserValidation = require("../validations/loginUserValidation");

// =============== api/auth ================= //
router.post("/", loginUserValidation, authController.autenticarUsuario);

// =============== api/confirmation ================= //
router.patch(
  "/confirmation/:token",
  auth,
  authController.confirmationEmailUser
);

// =============== api/auth/forgotPassword ================= //
router.patch("/forgotPassword", authController.forgotPassword);

// =============== api/resetPasswordUser ================= //
router.patch("/resetPasswordUser", authController.resetPasswordUser);

// =============== api/signInGoogle ================= //
router.post("/signInGoogle", authController.signInGoogle);

// =============== api/check-token ================= //
router.post("/check-token", authController.checkToken);

module.exports = router;
