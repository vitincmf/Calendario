const { Usuario } = require('../models');

async function listUsuarios() {
  return Usuario.findAll();
}

async function getUsuario(id) {
  return Usuario.findByPk(id);
}

async function createUsuario(data) {
  // Validar email único
  const usuarioExistente = await Usuario.findOne({ where: { email: data.email } });
  if (usuarioExistente) {
    throw new Error('Email já cadastrado');
  }
  return Usuario.create(data);
}

async function updateUsuario(id, data) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error('Usuário não encontrado');
  return usuario.update(data);
}

async function deleteUsuario(id) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error('Usuário não encontrado');
  return usuario.destroy();
}

async function loginUsuario(email, senha) {
  const usuario = await Usuario.findOne({ where: { email, senha } });
  if (!usuario) {
    throw new Error('Email ou senha inválidos');
  }
  return usuario;
}

module.exports = { listUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario, loginUsuario };