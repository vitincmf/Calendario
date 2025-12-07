const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConfiguracaoNotificacao = sequelize.define('ConfiguracaoNotificacao', {
  usuarioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  notificarEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notificarPush: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notificarEventos: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tempoAntecedencia: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: 'Tempo em minutos de antecedência para lembrete'
  }
}, {
  tableName: 'configuracoes_notificacao',
  timestamps: true,
  comment: 'Só salva se diferente do padrão'
});

module.exports = ConfiguracaoNotificacao;