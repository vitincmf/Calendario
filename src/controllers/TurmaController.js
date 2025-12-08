const { Turma } = require('../models');

async function listTurmas() {
  return Turma.findAll({ include: ['administrador', 'usuarios'] });
}

async function getTurma(id) {
  return Turma.findByPk(id, { include: ['administrador', 'usuarios'] });
}

async function createTurma(data) {
  return Turma.create(data);
}

async function updateTurma(id, data) {
  const turma = await Turma.findByPk(id);
  if (!turma) throw new Error('Turma não encontrada');
  return turma.update(data);
}

async function deleteTurma(id) {
  const turma = await Turma.findByPk(id);
  if (!turma) throw new Error('Turma não encontrada');
  return turma.destroy();
}

module.exports = { listTurmas, getTurma, createTurma, updateTurma, deleteTurma };