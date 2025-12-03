// models/Event.js
const { Model, DataTypes } = require("sequelize");

class Event extends Model {}

module.exports = (sequelize) => {
  Event.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: DataTypes.TEXT,
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM("PESSOAL", "INSTITUCIONAL"),
        allowNull: false
      },
      location: DataTypes.STRING,
      ownerId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Event",
      tableName: "events"
    }
  );

  return Event;
};