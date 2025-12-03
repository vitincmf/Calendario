// models/index.js
const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const UserModel = require("./User");
const EventModel = require("./Event");
const EventParticipantModel = require("./EventParticipant");

const connection = new Sequelize(dbConfig);

const User = UserModel(connection);
const Event = EventModel(connection);
const EventParticipant = EventParticipantModel(connection);

// Associações
User.hasMany(Event, { foreignKey: "ownerId", as: "eventsOwned" });
Event.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

User.belongsToMany(Event, {
  through: EventParticipant,
  foreignKey: "userId",
  as: "events"
});

Event.belongsToMany(User, {
  through: EventParticipant,
  foreignKey: "eventId",
  as: "participants"
});

module.exports = {
  connection,
  User,
  Event,
  EventParticipant
};