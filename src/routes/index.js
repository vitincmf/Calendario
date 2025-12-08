const express = require('express');
const router = express.Router();

// Importar controllers (lógica de negócio)
const {
  UsuarioController,
  TurmaController,
  EventoController,
  MarcadorController
} = require('../controllers');

// ===== ROTAS DE AUTENTICAÇÃO =====
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    const usuario = await UsuarioController.loginUsuario(email, senha);
    res.json(usuario);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const usuario = await UsuarioController.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== ROTAS DE USUÁRIOS =====
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await UsuarioController.listUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/usuarios', async (req, res) => {
  try {
    const usuario = await UsuarioController.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await UsuarioController.getUsuario(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await UsuarioController.updateUsuario(req.params.id, req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/usuarios/:id', async (req, res) => {
  try {
    await UsuarioController.deleteUsuario(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ===== ROTAS DE TURMAS =====
router.get('/turmas', async (req, res) => {
  try {
    const turmas = await TurmaController.listTurmas();
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/turmas', async (req, res) => {
  try {
    const turma = await TurmaController.createTurma(req.body);
    res.status(201).json(turma);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/turmas/:id', async (req, res) => {
  try {
    const turma = await TurmaController.getTurma(req.params.id);
    res.json(turma);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/turmas/:id', async (req, res) => {
  try {
    const turma = await TurmaController.updateTurma(req.params.id, req.body);
    res.json(turma);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/turmas/:id', async (req, res) => {
  try {
    await TurmaController.deleteTurma(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ===== ROTAS DE EVENTOS =====
router.get('/eventos', async (req, res) => {
  try {
    const eventos = await EventoController.listEventos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/eventos', async (req, res) => {
  try {
    const evento = await EventoController.createEvento(req.body);
    res.status(201).json(evento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/eventos/:id', async (req, res) => {
  try {
    const evento = await EventoController.getEvento(req.params.id);
    res.json(evento);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/eventos/:id', async (req, res) => {
  try {
    const evento = await EventoController.updateEvento(req.params.id, req.body);
    res.json(evento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/eventos/:id', async (req, res) => {
  try {
    await EventoController.deleteEvento(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ===== ROTAS DE MARCADORES =====
router.get('/marcadores', async (req, res) => {
  try {
    const marcadores = await MarcadorController.listMarcadores();
    res.json(marcadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/marcadores', async (req, res) => {
  try {
    const marcador = await MarcadorController.createMarcador(req.body);
    res.status(201).json(marcador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/marcadores/:id', async (req, res) => {
  try {
    const marcador = await MarcadorController.getMarcador(req.params.id);
    res.json(marcador);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/marcadores/:id', async (req, res) => {
  try {
    const marcador = await MarcadorController.updateMarcador(req.params.id, req.body);
    res.json(marcador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/marcadores/:id', async (req, res) => {
  try {
    await MarcadorController.deleteMarcador(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ===== ROTAS DE EVENTOS USUARIOS =====
const { EventoUsuario } = require('../models');

router.post('/eventos_usuarios', async (req, res) => {
  try {
    const { usuarioId, eventoId, cargo } = req.body;
    const eventoUsuario = await EventoUsuario.create({
      usuarioId,
      eventoId,
      cargo: cargo || 'Participante'
    });
    res.status(201).json(eventoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/eventos_usuarios', async (req, res) => {
  try {
    const eventoUsuarios = await EventoUsuario.findAll();
    res.json(eventoUsuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/eventos_usuarios/:eventoId/:usuarioId', async (req, res) => {
  try {
    await EventoUsuario.destroy({
      where: {
        eventoId: req.params.eventoId,
        usuarioId: req.params.usuarioId
      }
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;