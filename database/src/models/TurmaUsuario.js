const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TurmaUsuario = sequelize.define('TurmaUsuario', {
  turmaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'turmas',
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
    comment: 'Ex: Professor, Monitor, Tutor, Aluno, etc'
  }
}, {
  tableName: 'turmas_usuarios',
  timestamps: true
});

module.exports = TurmaUsuario;