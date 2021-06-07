var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");

const auth = require("../middelwares/authMiddelware");
const userController = require("../controllers/userController");
const createUserValidator = require("../validations/createUserValidator");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("¡Solo se permiten los formatos .png, .jpg y .jpeg!")
      );
    }
  },
});

// =============== api/usuario - create user ================= //
router.post("/", createUserValidator, userController.createUser);

// =============== api/usuario - get user ================= //
router.get("/", auth, userController.cuentaUsuario);

// =============== api/updateUser ================= //
router.patch("/updateUser", auth, upload.any(), userController.updateUser);

module.exports = router;
