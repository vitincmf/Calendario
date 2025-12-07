// Configuração do Sequelize para conectar ao banco de dados MySQL
// Carrega o .env relativo à raiz do projeto para permitir executar o app
// a partir de qualquer diretório (ex: executar o arquivo diretamente)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log, // Mude para false para desabilitar logs ou console.log para ver queries
    define: {
      timestamps: true, // Adiciona createdAt e updatedAt automaticamente
      underscored: false, // Usa camelCase ao invés de snake_case
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;