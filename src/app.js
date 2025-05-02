// src/app.js
const express = require('express');
const simulationRoute = require('./routes/simulation');

const app = express();
app.use(express.json());

// Ruta para ejecutar tu simulación
app.use('/run-simulation', simulationRoute);

module.exports = app;
