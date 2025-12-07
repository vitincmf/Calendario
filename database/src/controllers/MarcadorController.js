const { Marcador } = require('../models');

async function listMarcadores() {
  return Marcador.findAll();
}

async function createMarcador(data) {
  return Marcador.create(data);
}

module.exports = { listMarcadores, createMarcador };