var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No hay Token, permiso no válido" });
  }

  token = token.split(" ")[1];

  jwt.verify(token, process.env.KEY_SECTRET_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Error, token no valido" });
    } else {
      req.usuario = decoded.usuario;
      next();
    }
  });
};
