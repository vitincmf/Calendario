const { Evento } = require('../models');

async function listEventos() {
  return Evento.findAll({ include: ['turma', 'marcador', 'usuarios'] });
}

async function getEvento(id) {
  return Evento.findByPk(id, { include: ['turma', 'marcador', 'usuarios'] });
}

async function createEvento(data) {
  return Evento.create(data);
}

async function updateEvento(id, data) {
  const evento = await Evento.findByPk(id);
  if (!evento) throw new Error('Evento não encontrado');
  return evento.update(data);
}

async function deleteEvento(id) {
  const evento = await Evento.findByPk(id);
  if (!evento) throw new Error('Evento não encontrado');
  return evento.destroy();
}

module.exports = { listEventos, getEvento, createEvento, updateEvento, deleteEvento };