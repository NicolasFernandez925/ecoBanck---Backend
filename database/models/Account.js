module.exports = (sequelize, dataType) => {
  let alias = "Cuenta";

  let cols = {
    id: {
      type: dataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    cbu: {
      type: dataType.INTEGER(100),
      allowNull: false,
      unique: true,
    },
    cajaDeAhorroPesos: {
      type: dataType.INTEGER(30),
      defaultValue: 0,
      allowNull: false,
    },
    cajaDeAhorroDolares: {
      type: dataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    ingresosPesos: {
      type: dataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    egresosPesos: {
      type: dataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    ingresosDolares: {
      type: dataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    egresosDolares: {
      type: dataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    user_id: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    cuit: {
      type: dataType.INTEGER(12),
      allowNull: false,
    },
    dni: {
      type: dataType.INTEGER(15),
      allowNull: false,
    },
    creada: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },
  };

  let config = {
    tableName: "accounts",
    timestamps: true,
  };

  const Account = sequelize.define(alias, cols, config);

  Account.associate = (models) => {
    Account.belongsTo(models.Usuarios, {
      as: "usuario",
      foreignKey: "user_id",
    });
  };

  return Account;
};
