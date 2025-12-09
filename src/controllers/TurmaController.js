const { Turma, TurmaUsuario } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

async function listTurmas() {
  return Turma.findAll({ include: ['administrador', 'usuarios'] });
}

async function getTurma(id) {
  return Turma.findByPk(id, { include: ['administrador', 'usuarios'] });
}

async function createTurma(data) {
  const transaction = await sequelize.transaction();

  try {
    const {
      nome,
      descricao,
      tipo,
      publico = false,
      administradorId,
      criadorId,
      usuarioIds = []
    } = data;

    console.log('createTurma dados recebidos:', { nome, descricao, tipo, publico, administradorId, criadorId, usuarioIds });

    if (!nome) throw new Error('Nome da turma é obrigatório');
    const adminId = administradorId || criadorId;
    if (!adminId) throw new Error('Administrador da turma é obrigatório');

    const turma = await Turma.create({
      nome,
      descricao,
      tipo,
      publico,
      administradorId: adminId
    }, { transaction });

    console.log('Turma criada com ID:', turma.id);

    // Garante que admin e criador estejam na turma
    const memberIds = new Set(usuarioIds);
    memberIds.add(adminId);
    if (criadorId) memberIds.add(criadorId);

    console.log('Member IDs a adicionar:', Array.from(memberIds));

    // Inserir um por um para melhor debug
    for (const uid of memberIds) {
      const cargo = uid === adminId ? 'Administrador' : 'Participante';
      console.log(`Inserindo usuário ${uid} com cargo ${cargo}`);
      
      await TurmaUsuario.create({
        turmaId: turma.id,
        usuarioId: uid,
        cargo: cargo
      }, { transaction });
    }

    await transaction.commit();
    
    console.log('Turma e associações criadas com sucesso');
    
    // Retorna a turma com os usuários inclusos
    const turmaCompleta = await Turma.findByPk(turma.id, { include: ['administrador', 'usuarios'] });
    console.log('Turma retornada:', turmaCompleta);
    return turmaCompleta;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function listTurmasVisiveis(usuarioId) {
  if (!usuarioId) {
    return Turma.findAll({ include: ['administrador', 'usuarios'] });
  }

  const turmaUsuarios = await TurmaUsuario.findAll({ where: { usuarioId }, raw: true });
  const turmaIds = turmaUsuarios.map(tu => tu.turmaId);

  const turmas = await Turma.findAll({
    where: {
      [Op.or]: [
        { publico: true },
        { id: turmaIds }
      ]
    },
    include: ['administrador', 'usuarios']
  });

  // Marca se o usuário já participa
  const idsSet = new Set(turmaIds);
  return turmas.map(turma => {
    const t = turma.toJSON ? turma.toJSON() : turma;
    return { ...t, participa: idsSet.has(t.id) };
  });
}

async function adicionarUsuario(turmaId, usuarioId) {
  const turma = await Turma.findByPk(turmaId);
  if (!turma) throw new Error('Turma não encontrada');

  await TurmaUsuario.findOrCreate({
    where: { turmaId, usuarioId },
    defaults: { cargo: 'Participante' }
  });

  return Turma.findByPk(turmaId, { include: ['administrador', 'usuarios'] });
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

module.exports = { listTurmas, getTurma, createTurma, updateTurma, deleteTurma, listTurmasVisiveis, adicionarUsuario };