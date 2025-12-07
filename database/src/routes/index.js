const express = require('express');
const router = express.Router();

// Importar controllers (lógica de negócio)
const {
  UsuarioController,
  TurmaController,
  EventoController,
  MarcadorController
} = require('../controllers');

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

module.exports = router;