// Observer.js
class Notificador {
    static observadores = [];
    static suscribir(observador) {
        console.log(`[Observer] Observador suscrito: ${observador.constructor.name}`);
        this.observadores.push(observador);
    }
    static notificar(mensaje) {
        console.log(`[Observer] Notificando observadores: ${mensaje}`);
        this.observadores.forEach(obs => obs.actualizar(mensaje));
    }
}

class ObservadorConsola {
    actualizar(mensaje) {
        console.log(`[Observer] ObservadorConsola recibió: ${mensaje}`);
    }
}

module.exports = { Notificador, ObservadorConsola };