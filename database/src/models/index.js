//padronização de importação e exportação dos modelos
//const {[Tabela]} = require('../models');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Turma = require('./Turma');
const TurmaUsuario = require('./TurmaUsuario');
const Evento = require('./Evento');
const EventoUsuario = require('./EventoUsuario');
const Marcador = require('./Marcador');
const Frequencia = require('./Frequencia');
const ConfiguracaoNotificacao = require('./ConfiguracaoNotificacao');
const ConfiguracaoAcessibilidade = require('./ConfiguracaoAcessibilidade');

const setupAssociations = () => {
  
  Usuario.belongsToMany(Turma, {
    through: TurmaUsuario,
    foreignKey: 'usuarioId',
    as: 'turmas',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Turma.belongsToMany(Usuario, {
    through: TurmaUsuario,
    foreignKey: 'turmaId',
    as: 'usuarios',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Turma.belongsTo(Usuario, {
    foreignKey: 'administradorId',
    as: 'administrador',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  Usuario.belongsToMany(Evento, {
    through: EventoUsuario,
    foreignKey: 'usuarioId',
    as: 'eventos',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Evento.belongsToMany(Usuario, {
    through: EventoUsuario,
    foreignKey: 'eventoId',
    as: 'usuarios',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Evento.belongsTo(Turma, {
    foreignKey: 'turmaId',
    as: 'turma',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Turma.hasMany(Evento, {
    foreignKey: 'turmaId',
    as: 'eventos',
  });

  Marcador.belongsTo(Evento, {
    foreignKey: 'evento_id',
    as: 'evento',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Evento.hasMany(Marcador, {
    foreignKey: 'evento_id',
    as: 'marcadores'
  });

  Usuario.hasOne(ConfiguracaoNotificacao, {
    foreignKey: 'usuarioId',
    as: 'configuracaoNotificacao'
  });
  
  ConfiguracaoNotificacao.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Usuario.hasOne(ConfiguracaoAcessibilidade, {
    foreignKey: 'usuarioId',
    as: 'configuracaoAcessibilidade'
  });
  
  ConfiguracaoAcessibilidade.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Frequencia.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Usuario.hasMany(Frequencia, {
    foreignKey: 'usuarioId',
    as: 'frequencias'
  });

  Frequencia.belongsTo(Evento, {
    foreignKey: 'eventoId',
    as: 'evento',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Evento.hasMany(Frequencia, {
    foreignKey: 'eventoId',
    as: 'frequencias'
  });
};

setupAssociations();

module.exports = {
  sequelize,
  Usuario,
  Turma,
  TurmaUsuario,
  Evento,
  EventoUsuario,
  Marcador,
  Frequencia,
  ConfiguracaoNotificacao,
  ConfiguracaoAcessibilidade
};