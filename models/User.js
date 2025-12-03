// models/User.js
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = (sequelize) => {
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.VIRTUAL,
        set(value) {
          this.setDataValue("password", value);
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password_hash", hash);
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users"
    }
  );

  return User;
};