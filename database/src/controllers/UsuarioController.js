const { Usuario } = require('../models');

async function listUsuarios() {
  return Usuario.findAll();
}

async function createUsuario(data) {
  return Usuario.create(data);
}

module.exports = { listUsuarios, createUsuario };