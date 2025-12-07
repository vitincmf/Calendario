const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventoUsuario = sequelize.define('EventoUsuario', {
  eventoId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'eventos',
      key: 'id'
    }
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  cargo: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Ex: Coordenador, Participante, Organizador, etc'
  }
}, {
  tableName: 'eventos_usuarios',
  timestamps: true
});

module.exports = EventoUsuario;