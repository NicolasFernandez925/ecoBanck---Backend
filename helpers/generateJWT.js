const jwt = require("jsonwebtoken");

exports.generateJWT = (id) => {
  return new Promise((resolve, reject) => {
    const payload = {
      usuario: {
        id: id,
      },
    };
    jwt.sign(
      payload,
      process.env.KEY_SECTRET_TOKEN,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) {
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};
