const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConfiguracaoAcessibilidade = sequelize.define('ConfiguracaoAcessibilidade', {
  usuarioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  tamanhoFonte: {
    type: DataTypes.ENUM('Pequeno', 'Medio', 'Grande', 'ExtraGrande'),
    defaultValue: 'Medio'
  },
  altoContraste: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  AudioDescricao: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tema: {
    type: DataTypes.ENUM('Claro', 'Escuro', 'Sistema'),
    defaultValue: 'Sistema'
  }
}, {
  tableName: 'configuracoes_acessibilidade',
  timestamps: true,
  comment: 'Só salva se diferente do padrão'
});

module.exports = ConfiguracaoAcessibilidade;