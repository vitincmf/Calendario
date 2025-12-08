// routes/event.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Event, EventParticipant } = require("../models");

// POST /eventos/pessoal -> criar evento pessoal
router.post("/pessoal", auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, location } = req.body;

    if (!title || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Título e datas são obrigatórios." });
    }

    const ownerId = req.user.id;

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      location,
      type: "PESSOAL",
      ownerId
    });

    await EventParticipant.create({
      eventId: event.id,
      userId: ownerId,
      role: "OWNER",
      status: "CONFIRMED"
    });

    return res.status(201).json(event);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao criar evento pessoal." });
  }
});

// GET /eventos/me -> listar eventos do usuário logado
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await Event.findAll({
      include: [
        {
          association: "participants",
          where: { id: userId }
        }
      ]
    });

    return res.json(events);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erro ao listar eventos do usuário." });
  }
});

module.exports = router;