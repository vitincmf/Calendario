const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING(255), //hash
    allowNull: false
  },
  senha_2fa: {
    type: DataTypes.STRING(255), //hash
    allowNull: true,
    comment: 'Senha para autenticação de dois fatores'
  },
  cargo: {
    type: DataTypes.ENUM('Aluno', 'Professor', 'Coordenador', 'Visitante'),
    allowNull: false,
    defaultValue: 'Aluno'
  },
  foto: {
    type: DataTypes.BLOB,
    allowNull: true,
    comment: 'URL da foto do usuário'
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;