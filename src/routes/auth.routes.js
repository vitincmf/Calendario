// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const jwtConfig = require("../config/jwt");

// POST /autent/register -> cria usuário
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao registrar usuário." });
  }
});

// POST /autent/login -> login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao autenticar usuário." });
  }
});

module.exports = router;