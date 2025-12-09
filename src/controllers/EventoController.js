const { Evento, EventoUsuario, TurmaUsuario, Turma, Marcador } = require('../models');
const sequelize = require('../config/database');

async function listEventos() {
  return Evento.findAll({ include: ['turma', 'marcadores', 'usuarios'] });
}

async function getEvento(id) {
  return Evento.findByPk(id, { include: ['turma', 'marcadores', 'usuarios'] });
}

async function listEventosPorUsuario(usuarioId) {
  try {
    // Busca os IDs dos eventos associados a este usuário
    const eventosUsuarios = await EventoUsuario.findAll({
      where: { usuarioId },
      raw: true
    });
    
    console.log(`Eventos encontrados para usuário ${usuarioId}:`, eventosUsuarios);
    
    // Extrai os IDs dos eventos do usuário
    const eventoIds = eventosUsuarios.map(eu => eu.eventoId);
    
    // Busca eventos do usuário E eventos públicos
    const eventos = await Evento.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { id: eventoIds },           // Eventos do usuário
          { publico: true }             // Eventos públicos
        ]
      },
      include: ['turma', 'usuarios', 'marcadores']
    });
    
    // Enriquece os eventos com informação de proprietário
    const eventosEnriquecidos = eventos.map(evento => {
      const eventoObj = evento.toJSON ? evento.toJSON() : evento;
      
      // Identifica o primeiro usuário como proprietário (quem criou)
      const proprietarioId = eventoObj.usuarios && eventoObj.usuarios.length > 0 
        ? eventoObj.usuarios[0].id 
        : null;
      
      return {
        ...eventoObj,
        proprietarioId,
        usuarioId: proprietarioId // alias para compatibilidade
      };
    });
    
    console.log(`Total de eventos retornados:`, eventosEnriquecidos.length);
    
    return eventosEnriquecidos;
  } catch (error) {
    console.error('Erro em listEventosPorUsuario:', error);
    throw error;
  }
}

async function createEvento(data) {
  // Usa as datas recebidas como já estão (string local), sem ajustar fuso no backend
  return Evento.create({
    ...data,
    dataInicio: data.dataInicio || null,
    dataFim: data.dataFim || null
  });
}

// Cria um evento institucional de turma e associa todos os usuários da turma (incluindo o administrador/criador)
async function createEventoTurma(data) {
  const transaction = await sequelize.transaction();

  try {
    if (!data.turmaId) {
      throw new Error('turmaId é obrigatório para evento institucional');
    }

    if (!data.criadorId) {
      throw new Error('criadorId é obrigatório');
    }

    const turma = await Turma.findByPk(data.turmaId, { transaction, raw: true });
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    if (turma.administradorId !== data.criadorId) {
      throw new Error('Apenas o administrador da turma pode criar eventos da turma');
    }

    const evento = await Evento.create({
      ...data,
      dataInicio: data.dataInicio || null,
      dataFim: data.dataFim || null
    }, { transaction });

    // Busca todos os usuários da turma
    const turmaUsuarios = await TurmaUsuario.findAll({
      where: { turmaId: data.turmaId },
      transaction,
      raw: true
    });

    const userIds = new Set();
    turmaUsuarios.forEach(tu => userIds.add(tu.usuarioId));
    if (turma && turma.administradorId) userIds.add(turma.administradorId);
    if (data.criadorId) userIds.add(data.criadorId);

    const associacoes = Array.from(userIds).map(uid => ({
      eventoId: evento.id,
      usuarioId: uid,
      cargo: uid === data.criadorId ? 'Administrador' : 'Participante'
    }));

    if (associacoes.length > 0) {
      await EventoUsuario.bulkCreate(associacoes, {
        transaction,
        ignoreDuplicates: true
      });
    }

    // Cria marcador da turma para o evento
    if (turma && turma.nome) {
      await Marcador.findOrCreate({
        where: { evento_id: evento.id, texto_marcador: `Turma: ${turma.nome}` },
        transaction
      });
    }

    await transaction.commit();
    return evento;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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

module.exports = { listEventos, getEvento, createEvento, createEventoTurma, updateEvento, deleteEvento, listEventosPorUsuario };