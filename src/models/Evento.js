const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define('Evento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dataInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dataFim: {
    type: DataTypes.DATE,
    allowNull: true
  },
  publico: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'True = público, False = privado'
  },
  turmaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'turmas',
      key: 'id'
    },
    comment: 'Evento pode ou não estar vinculado a uma turma'
  }
}, {
  tableName: 'eventos',
  timestamps: true
});

module.exports = Evento;