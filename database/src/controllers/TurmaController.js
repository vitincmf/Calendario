const { Turma } = require('../models');

async function listTurmas() {
  return Turma.findAll({ include: ['administrador', 'usuarios'] });
}

async function createTurma(data) {
  return Turma.create(data);
}

module.exports = { listTurmas, createTurma };