const { validationResult } = require("express-validator");

const db = require("../database/models");

exports.operaciones = async (req, res) => {
  try {
    const operaciones = await db.Operaciones.findAll({
      where: {
        user_id: req.usuario.id,
      },
      order: [["createdAt", "DESC"]],
      attributes: ["createdAt", "motivo", "monto", "id"],
      include: {
        association: "tipoOperaciones",
        attributes: ["nombre"],
      },
    });
    res.status("200").json({ operaciones });
  } catch (error) {
    res.status("500").json({ msg: "Hubo un error : " + error });
  }
};

exports.createOperation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array() });
  }
  const { motivo, tipoOperacion, monto } = req.body;

  try {
    const user = await db.Usuarios.findOne({
      where: {
        id: req.usuario.id,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    const operation = await db.Operaciones.create({
      motivo: motivo,
      user_id: req.usuario.id,
      typeOperation_id: tipoOperacion,
      monto: monto,
    });

    res.status(200).json({ operation });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error en el servidor" + error });
  }
};

exports.balance = async (req, res) => {
  try {
    const operaciones = await db.Operaciones.findAll({
      where: {
        user_id: req.usuario.id,
      },
      include: {
        association: "tipoOperaciones",
        attributes: ["nombre"],
      },
    });

    let ingresos = 0;
    let egresos = 0;
    let totalIngresosPesos = 0;
    let totalEgresosPesos = 0;
    let balanceTotalPesos = 0;

    if (operaciones.length === 0) {
      return res.status(200).json({ msg: "No hay operaciones realizadas." });
    }

    let totalMontoPesos = operaciones.map((op) => {
      if (op.tipoOperaciones.nombre === "ingreso") {
        totalIngresosPesos += op.monto;
        ingresos++;
        return op.monto;
      } else if (op.tipoOperaciones.nombre === "egreso") {
        egresos++;
        totalEgresosPesos -= op.monto;
        return Number("-" + op.monto);
      }
      return 0;
    });

    balanceTotalPesos = totalMontoPesos.reduce((acum, monto) => {
      return acum + monto;
    });

    return res.status(200).json({
      ingresos,
      egresos,
      balanceTotalPesos,
      totalIngresosPesos,
      totalEgresosPesos,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Hubo un error en el servidor" + error });
  }
};

exports.editOperation = async (req, res) => {
  const { idOperation } = req.params;
  const { monto, motivo, tipoOperacion } = req.body;
  const { id } = req.usuario;

  try {
    const user = await db.Usuarios.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    let operation = await db.Operaciones.findOne({
      where: {
        id: idOperation,
        user_id: id,
      },
    });

    if (!operation) {
      return res
        .status(400)
        .json({ msg: "El usuario no tiene una operacion hecha" });
    }

    operation = await db.Operaciones.update(
      {
        motivo: motivo.trim(),
        monto: monto,
        tipoOperacion: tipoOperacion,
      },
      {
        where: {
          id: idOperation,
          user_id: id,
        },
      }
    );

    operation = await db.Operaciones.findOne({
      where: {
        id: idOperation,
        user_id: id,
      },
    });

    res
      .status(200)
      .json({ msg: "Se actualizo correctamente la operación!", operation });
  } catch (error) {
    res.status(500).json({ msg: "Error en el server " + error });
  }
};

exports.deleteOperation = async (req, res) => {
  const idOperation = req.params.idOperation;

  const { id } = req.usuario;

  try {
    const user = await db.Usuarios.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    const operation = await db.Operaciones.findOne({
      where: {
        id: idOperation,
        user_id: id,
      },
    });

    if (!operation) {
      return res
        .status(400)
        .json({ msg: "El usuario no tiene una operacion hecha" });
    }

    await db.Operaciones.destroy({
      where: {
        id: idOperation,
        user_id: id,
      },
    });

    res
      .status(200)
      .json({ msg: "Se borro correctamente la operación!", operation });
  } catch (error) {
    res.status(500).json({ msg: "Error en el server " + error });
  }
};
