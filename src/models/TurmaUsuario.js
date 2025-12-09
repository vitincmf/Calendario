const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TurmaUsuario = sequelize.define('TurmaUsuario', {
  turmaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'turmas',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  cargo: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Ex: Professor, Monitor, Tutor, Aluno, etc'
  }
}, {
  tableName: 'turmas_usuarios',
  timestamps: true
});

module.exports = TurmaUsuario;