const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Marcador = sequelize.define('Marcador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  evento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'eventos',
      key: 'id'
    }
  },
  texto_marcador: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
}, {
  tableName: 'marcadores',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['evento_id', 'texto_marcador'] 
    }
  ]
});

module.exports = Marcador;