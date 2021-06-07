const db = require("../database/models");
const { cloudinary } = require("../helpers/cloudinary");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const transporter = require("../config/mailer");
const { getRandom } = require("../helpers/getRandom");
const { generateJWT } = require("../helpers/generateJWT");

exports.createUser = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ error: errores.array() });
  }

  const { name, surname, email, password, dni } = req.body;

  let usuario = await db.Usuarios.findOne({
    where: {
      email: email,
    },
  });

  if (usuario) {
    return res.status(400).json({
      error: "El usuario ya esta registrado con ese mail",
      msg: "El usuario ya esta registrado con ese mail",
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  usuario = await db.Usuarios.create({
    nombre: name,
    apellido: surname,
    email: email,
    password: passwordHash,
    dni: dni,
    cbu: getRandom(),
    confirmed: false,
  });

  const token = await generateJWT(usuario.id);

  let verificationLink = `http://localhost:3000/auth/authentication/confirmation/${token}`;

  try {
    await transporter.sendMail({
      from: `EcoBank <${process.env.MAIL_USER}>`,
      to: usuario.email, //usuario.email
      subject: "Activación de cuenta ✔",
      html: `
        <div class="body" style="width: 80%;max-width:700px;heigth: 100%;padding: 30px;margin: 0 auto;background-color: #f6f5f5;border-radius: 10px; border:1px solid gray"><h1 style="color:#7868e6; text-align:center; font-size:50px";>Hola, ${usuario.nombre}!</h1><h2 style="text-align:center;font-size:30px; color:#7868e6;">Gracias por registrarte en EcoBank</h2><h3 style="text-align: center;color:#8e7f7f;">Verifica tu cuenta haciendo click en el siguiente boton:</h3><div class="boton" style="display: flex;flex-wrap: wrap;align-content: center;"><a href="${verificationLink}" style="display: inline-block;margin: 0 auto;margin-top: 10px;padding: 8px 15px;background-color: #F05454;text-decoration: none;color: #fff;border: 2px solid #F05454;border-radius: 10px;box-shadow: 1px 1px 4px 0px #000;font-weight: 600;margin-bottom:12px">Click aquí!</a></div>
        <hr>
        <p style="font-size:10px;">Banco EcoBank S.A. es una sociedad anónima según la ley argentina.
        Ningún accionista mayoritario de capital extranjero responde por las operaciones del Banco en exceso de su integración accionaria (Ley N.º 25.738); tampoco lo hacen otras entidades que utilicen la marca EcoBank.</p></div>
      `,
    });

    res.status(200).json({
      error: null,
      msg: "Email enviado, verificar cuenta",
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error, msg: error });
  }
};

exports.cuentaUsuario = async (req, res) => {
  try {
    const cuentaUser = await db.Usuarios.findOne({
      where: { id: req.usuario.id },
    });

    if (!cuentaUser) {
      return res.status(400).json({ msg: "Error, el usuario no existe" });
    }

    res.status(200).json({ cuentaUser });
  } catch (error) {
    res.status(500).json({ msg: "Server error" + error });
  }
};

exports.updateUser = async (req, res, next) => {
  const { email, password } = req.body;

  let file;
  let result;

  try {
    const user = await db.Usuarios.findOne({
      where: {
        id: req.usuario.id,
      },
    });

    const passwordHash = bcrypt.hashSync(password, 10);

    if (!user) {
      return res.status(400).json({ msg: "Error, el usuario no existe" });
    }

    if (bcrypt.compareSync(password, user.password)) {
      return res
        .status(400)
        .json({ msg: "Debe ingresar contraseñas diferentes" });
    }

    if (req.files[0] === undefined) {
      await db.Usuarios.update(
        {
          email,
          password: passwordHash,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      return res.status(200).json({ msg: "ok", user });
    }

    file = req.files[0].path;
    result = await cloudinary.uploader.upload(file);

    await db.Usuarios.update(
      {
        image: result.secure_url,
        email,
        password: passwordHash,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.status(200).json({ msg: "ok", user });
  } catch (error) {
    res.status(500).json({ msg: "Server error" + error });
  }
};
