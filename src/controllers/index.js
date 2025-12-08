//padronização de importação e exportação dos controllers
//const { [Tabela]Controller } = require('../controllers');
const UsuarioController = require('./UsuarioController');
const TurmaController = require('./TurmaController');
const EventoController = require('./EventoController');
const MarcadorController = require('./MarcadorController');

module.exports = {
   UsuarioController,
   TurmaController,
   EventoController,
   MarcadorController
};