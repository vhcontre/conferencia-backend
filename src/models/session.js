// session.js
class SessionState {
    handle(session) {
        throw new Error("Implementa handle()");
    }
}

class ReceptionState extends SessionState {
    handle(session) {
        console.log("[State] Estado actual: ReceptionState (Recepción de artículos)");
        session.setState(new BiddingState());
        console.log("[State] Transición a: BiddingState");
    }
}

class BiddingState extends SessionState {
    handle(session) {
        console.log("[State] Estado actual: BiddingState (Interés de revisores)");
        session.setState(new ReviewState());
        console.log("[State] Transición a: ReviewState");
    }
}

class ReviewState extends SessionState {
    handle(session) {
        console.log("[State] Estado actual: ReviewState (Evaluación de artículos)");
        session.setState(new SelectionState());
        console.log("[State] Transición a: SelectionState");
    }
}

class SelectionState extends SessionState {
    handle(session) {
        console.log("[State] Estado actual: SelectionState (Selección final de artículos)");
    }
}

class SelectionStrategy {
    selectArticles(articles) {
        throw new Error("Implementa selectArticles");
    }
}

class FixedCutoffStrategy extends SelectionStrategy {
    constructor(percentage) {
        super();
        this.percentage = percentage;
    }
    selectArticles(articles) {
        console.log(`[Strategy] Aplicando FixedCutoffStrategy (${this.percentage * 100}%)`);
        const num = Math.ceil(articles.length * this.percentage);
        const seleccionados = articles.sort((a, b) => b.score - a.score).slice(0, num);
        console.log(`[Strategy] Artículos seleccionados: ${seleccionados.map(a => a.title).join(", ")}`);
        return seleccionados;
    }
}

class Session {
    constructor(name, strategy) {
        this.name = name;
        this.articles = [];
        this.state = new ReceptionState();
        this.selectionStrategy = strategy;
        console.log(`[Session] Sesión creada: ${name}`);
    }
    setState(newState) {
        this.state = newState;
    }
    processState() {
        console.log(`[State] Procesando estado de la sesión: ${this.name}`);
        this.state.handle(this);
    }
    selectArticles() {
        return this.selectionStrategy.selectArticles(this.articles);
    }
}

module.exports = { Session, FixedCutoffStrategy, ReceptionState, BiddingState, ReviewState, SelectionState };