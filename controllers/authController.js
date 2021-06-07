const db = require("../database/models");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailer");
const { googleVerify } = require("../helpers/googleVerify");
const { getRandom } = require("../helpers/getRandom");
const { generateJWT } = require("../helpers/generateJWT");

exports.autenticarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, password } = req.body;

  let usuario = await db.Usuarios.findOne({
    where: {
      email,
    },
  });

  if (!usuario) {
    return res
      .status(401)
      .json({ error: "El usuario no existe", msg: "El usuario no existe" });
  }
  let passCorrecto = bcrypt.compareSync(password, usuario.password);

  if (!passCorrecto) {
    return res.status(401).json({
      error: "Ingrese una contraseña valida",
      msg: "Ingrese una contraseña valida",
    });
  }

  const token = await generateJWT(usuario.id);

  res.status(200).json({ error: null, msg: "Ok", token, usuario });
};

exports.confirmationEmailUser = async (req, res) => {
  const { token } = req.params;

  const user = await db.Usuarios.findOne({
    where: {
      id: req.usuario.id,
    },
  });

  if (user.confirmed) {
    console.log("el usaurio ya esta confirmado");
    return res
      .status(401)
      .json({ msg: "El usuario ya se encuentra autenticado" });
  }
  try {
    jwt.verify(token, process.env.KEY_SECTRET_TOKEN, async (error, decoded) => {
      if (error) {
        res.status(400).json({ msg: "la cuenta ya se encuentra activada" });
      }

      await db.Usuarios.update(
        { confirmed: true },
        { where: { id: decoded.usuario.id } }
      );
      res.status(200).json({ msg: "ok", user });
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" + error });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await db.Usuarios.findOne({
    where: {
      email,
    },
  });

  if (!usuario) {
    res
      .status(400)
      .json({ error: "El usuario no existe", msg: "El usuario no existe" });
  }

  const token = await generateJWT(usuario.id);

  await db.Usuarios.update(
    {
      resetLinkToken: token,
    },
    {
      where: {
        id: usuario.id,
      },
    }
  );
  let resetLink = `http://localhost:3000/auth/resetPassword/${token}`;
  try {
    await transporter.sendMail({
      from: `EcoBank <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Recuperación de contraseña ✔",
      html: `
        <div class="body" style="width: 80%;max-width:700px;heigth: 100%;padding: 30px;margin: 0 auto;background-color: #f6f5f5;border-radius: 10px; border:1px solid gray"><h1 style="color:#7868e6; text-align:center; font-size:50px";>Hola, ${usuario.nombre}!</h1><h2 style="text-align:center;font-size:30px; color:#7868e6;">Recuperá tu contraseña</h2><h3 style="text-align: center;color:#8e7f7f;">Haciendo click en el siguiente boton:</h3><div class="boton" style="display: flex;flex-wrap: wrap;align-content: center;"><a href="${resetLink}" style="display: inline-block;margin: 0 auto;margin-top: 10px;padding: 8px 15px;background-color: #F05454;text-decoration: none;color: #fff;border: 2px solid #F05454;border-radius: 10px;box-shadow: 1px 1px 4px 0px #000;font-weight: 600;margin-bottom:12px">Click aquí!</a></div>
        <hr>
        <p style="font-size:10px;">Banco EcoBank S.A. es una sociedad anónima según la ley argentina.
        Ningún accionista mayoritario de capital extranjero responde por las operaciones del Banco en exceso de su integración accionaria (Ley N.º 25.738); tampoco lo hacen otras entidades que utilicen la marca EcoBank.</p></div>
      `,
    });

    res
      .status(200)
      .json({ error: null, msg: "Se envio el mail para cambiar contraseña" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" + error });
  }
};

exports.resetPasswordUser = async (req, res) => {
  const { resetToken, password } = req.body;

  if (resetToken) {
    const decoded = jwt.verify(resetToken, process.env.KEY_SECTRET_TOKEN);

    if (!decoded) {
      return res
        .status(401)
        .json({ error: "Token incorrecto, expiro o no existe." });
    }
    try {
      const usuario = await db.Usuarios.findOne({
        where: {
          id: decoded.usuario.id,
        },
      });

      if (!usuario) {
        return res.status(400).json({ error: "El usuario no existe" });
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      await db.Usuarios.update(
        { resetLinkToken: null, password: passwordHash },
        {
          where: {
            id: decoded.usuario.id,
          },
        }
      );

      return res.status(200).json({
        error: null,
        msg: "El password fue actualizado correctamente!",
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }
};

exports.signInGoogle = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const { nombre, email, img } = await googleVerify(tokenId);
    let usuario = await db.Usuarios.findOne({
      where: {
        email: email,
      },
    });

    if (!usuario) {
      usuario = await db.Usuarios.create({
        nombre: nombre,
        email: email,
        cbu: getRandom(),
        password: "",
        apellido: "",
        confirmed: true,
        google: true,
        resetLinkToken: null,
      });
    }

    usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cbu: usuario.cbu,
      google: usuario.google,
      email: usuario.email,
      imagen: img,
    };

    const token = await generateJWT(usuario.id);
    res.status(200).json({ error: null, msg: "Ok", usuario, token });
  } catch (error) {
    res.status(400).json({
      error: "Token de Google no válido",
      msg: "Token de Google no válido",
    });
  }
};

exports.checkToken = async (req, res) => {
  const { localToken } = req.body;
  try {
    jwt.verify(
      localToken,
      process.env.KEY_SECTRET_TOKEN,
      async (err, token) => {
        if (err) {
          return res.status(401).json({
            error: "El token no es valido o expiro",
          });
        }
        const { id } = token.usuario;

        const usuario = await db.Usuarios.findOne({
          where: {
            id,
          },
        });

        if (!usuario) {
          return res.status(401).json({
            error: "El token no es valido o expiro, o el usuario no existe",
          });
        }
        res.status(200).json({
          error: null,
          msg: "Token valido",
          localToken,
          usuario: usuario,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error en el server" + error });
  }
};
