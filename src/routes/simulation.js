// src/routes/simulation.js
const express = require('express');
const router = express.Router();
const runSimulation = require('../models/simulation');

router.get('/', async (req, res) => {
    try {
        const result = await runSimulation();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al ejecutar simulación' });
    }
});

module.exports = router;
