const { Marcador } = require('../models');

async function listMarcadores() {
  return Marcador.findAll();
}

async function getMarcador(id) {
  return Marcador.findByPk(id);
}

async function createMarcador(data) {
  return Marcador.create(data);
}

async function updateMarcador(id, data) {
  const marcador = await Marcador.findByPk(id);
  if (!marcador) throw new Error('Marcador não encontrado');
  return marcador.update(data);
}

async function deleteMarcador(id) {
  const marcador = await Marcador.findByPk(id);
  if (!marcador) throw new Error('Marcador não encontrado');
  return marcador.destroy();
}

module.exports = { listMarcadores, getMarcador, createMarcador, updateMarcador, deleteMarcador };