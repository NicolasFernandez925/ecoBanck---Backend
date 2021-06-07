module.exports = (sequelize, dataType) => {
  let alias = "TipoOperaciones";

  let cols = {
    id: {
      type: dataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: dataType.STRING(45),
      allowNull: false,
    },
  };

  let config = {
    tableName: "typeoperations",
    timestamps: true,
  };

  const TypeOperation = sequelize.define(alias, cols, config);

  TypeOperation.associate = (models) => {
    TypeOperation.hasOne(models.Operaciones, {
      as: "operaciones",
      foreignKey: "typeOperation_id",
    });
  };
  return TypeOperation;
};
