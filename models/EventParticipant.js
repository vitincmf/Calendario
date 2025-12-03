// models/EventParticipant.js
const { Model, DataTypes } = require("sequelize");

class EventParticipant extends Model {}

module.exports = (sequelize) => {
  EventParticipant.init(
    {
      role: {
        type: DataTypes.ENUM("OWNER", "PARTICIPANT"),
        defaultValue: "PARTICIPANT"
      },
      status: {
        type: DataTypes.ENUM("CONFIRMED", "PENDING", "DECLINED"),
        defaultValue: "CONFIRMED"
      }
    },
    {
      sequelize,
      modelName: "EventParticipant",
      tableName: "event_participants"
    }
  );

  return EventParticipant;
};