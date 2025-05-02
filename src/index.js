const express = require('express');
const runSimulation = require('./models/simulation');
const app = express();

app.get('/run-simulation', async (req, res) => {
    try {
        const resultado = await runSimulation();
        res.json(resultado);
    } catch (err) {
        console.error("Error en la simulación", err);
        res.status(500).send("Error en la simulación");
    }
});

app.listen(3000, () => {
    console.log("Servidor escuchando en puerto 3000");
});
