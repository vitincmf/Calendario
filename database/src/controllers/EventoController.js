const { Evento } = require('../models');

async function listEventos() {
  return Evento.findAll({ include: ['turma', 'marcador', 'usuarios'] });
}

async function createEvento(data) {
  return Evento.create(data);
}

module.exports = { listEventos, createEvento };