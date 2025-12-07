const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Frequencia = sequelize.define('Frequencia', {
  usuarioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  eventoId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'eventos',
      key: 'id'
    }
  },
  falta: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'True = falta, False = presença (não salvo)'
  }
}, {
  tableName: 'frequencias',
  timestamps: true,
  comment: 'Registro privado de faltas do próprio usuário'
});

module.exports = Frequencia;