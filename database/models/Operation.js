module.exports = (sequelize, dataType) => {
  let alias = "Operaciones";

  let cols = {
    id: {
      type: dataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    motivo: {
      type: dataType.STRING(100),
      allowNull: false,
    },
    user_id: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    typeOperation_id: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    monto: {
      type: dataType.INTEGER(100),
      allowNull: false,
    },
  };

  let config = {
    tableName: "operations",
    timestamps: true,
  };

  const Operation = sequelize.define(alias, cols, config);

  Operation.associate = (models) => {
    Operation.belongsTo(models.Usuarios, {
      as: "usuarios",
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };
  Operation.associate = (models) => {
    Operation.belongsTo(models.TipoOperaciones, {
      as: "tipoOperaciones",
      foreignKey: "typeOperation_id",
      onDelete: "CASCADE",
    });
  };

  return Operation;
};
