const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turma = sequelize.define('Turma', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Ex: classe, grupo de reunião, grupo do rpg, etc'
  },
  publico: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'True = pública, False = privada'
  },
  administradorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    comment: 'Usuário com permissão para editar/excluir turma'
  }
}, {
  tableName: 'turmas',
  timestamps: true
});

module.exports = Turma;