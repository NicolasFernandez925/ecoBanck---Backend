var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

require("dotenv").config();

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const routerAuth = require("./routes/auth");
const routerUsuario = require("./routes/usuarios");
const routerOperacion = require("./routes/operacion");

// Importar rutas
app.use("/api/auth", routerAuth);
app.use("/api/usuario", routerUsuario);
app.use("/api/operaciones", routerOperacion);

module.exports = app;
