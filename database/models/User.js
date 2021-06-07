module.exports = (sequelize, dataType) => {
  let alias = "Usuarios";

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
    apellido: {
      type: dataType.STRING(45),
      allowNull: false,
    },
    email: {
      type: dataType.STRING(45),
      allowNull: false,
      unique: true,
    },
    password: {
      type: dataType.STRING(255),
      allowNull: false,
    },
    cbu: {
      type: dataType.INTEGER(100),
      allowNull: true,
    },

    confirmed: {
      type: dataType.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    google: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },
    resetLinkToken: {
      type: dataType.INTEGER(250),
      defaultValue: null,
    },
    image: {
      type: dataType.STRING(200),
      defaultValue: null,
    },
  };

  let config = {
    tableName: "users",
    timestamps: true,
  };

  const User = sequelize.define(alias, cols, config);

  User.associate = (models) => {
    User.hasMany(models.Operaciones, {
      as: "operaciones",
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });

    User.hasOne(models.Cuenta, {
      as: "cuenta",
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };

  return User;
};
