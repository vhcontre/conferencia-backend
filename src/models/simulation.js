
const db = require('../database/db'); // Importar la base de datos

module.exports = async function runSimulation() {
    console.log("=== INICIO DE SIMULACIÓN ===");

    // Observer
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

    // Singleton
    class Conference {
        constructor(name) {
            if (Conference.instance) {
                console.log("[Singleton] Reutilizando instancia existente de Conference");
                return Conference.instance;
            }
            this.name = name;
            this.sessions = [];
            Conference.instance = this;
            console.log(`[Singleton] Se crea instancia única de Conference: ${name}`);
        }
        addSession(session) {
            console.log(`[Conference] Sesión agregada: ${session.name}`);
            this.sessions.push(session);
        }
    }

    // Factory Method
    class User {
        constructor(name, affiliation, email) {
            this.name = name;
            this.affiliation = affiliation;
            this.email = email;
        }

        // Persistir usuario en la base de datos
        save() {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO users (name, affiliation, email, type) VALUES (?, ?, ?, ?)");
                stmt.run(this.name, this.affiliation, this.email, this.constructor.name, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(this.lastID);  // Retorna el ID del usuario insertado
                });
            });
        }
    }

    class Chair extends User {}
    class Revisor extends User {
        expressInterest(article, interestLevel) {
            console.log(`[Revisor] ${this.name} expresa interés: ${interestLevel} en ${article.title}`);
        }
    }
    class Autor extends User {
        update(message) {
            console.log(`[Observer] ${this.name} recibió notificación: ${message}`);
        }
    }

    class UserFactory {
        static createUser(type, name, affiliation, email) {
            console.log(`[Factory] Creando usuario tipo: ${type}`);
            let user;
            switch (type) {
                case "Chair":
                    user = new Chair(name, affiliation, email);
                    break;
                case "Revisor":
                    user = new Revisor(name, affiliation, email);
                    break;
                case "Autor":
                    user = new Autor(name, affiliation, email);
                    break;
                default:
                    throw new Error("Tipo desconocido");
            }
            console.log(`[Factory] Usuario creado: ${user.name}, tipo: ${type}`);
            return user;
        }
    }

    // Article y Observer
    class Article {
        constructor(title, type) {
            this.title = title;
            this.type = type;
            this.authors = [];
            this.observers = [];
            this.score = 10; // puntuación dummy para Strategy
            console.log(`[Article] Artículo creado: ${title} (${type})`);
        }

        // Persistir artículo en la base de datos
        save() {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO articles (title, type, score) VALUES (?, ?, ?)");
                stmt.run(this.title, this.type, this.score, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(this.lastID);  // Retorna el ID del artículo insertado
                });
            });
        }

        addObserver(observer) {
            console.log(`[Observer] Observador agregado al artículo: ${this.title}`);
            this.observers.push(observer);
        }
        notifyObservers(msg) {
            console.log(`[Observer] Notificando observadores del artículo: ${this.title}`);
            this.observers.forEach(o => o.update(msg));
        }
        changeStatus(status) {
            console.log(`[Article] Estado del artículo '${this.title}' cambiado a: ${status}`);
            this.notifyObservers(`Estado del artículo '${this.title}' cambió a ${status}`);
        }

        // Asociar autor al artículo en la base de datos
        addAuthor(authorId) {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO article_authors (article_id, user_id) VALUES (?, ?)");
                stmt.run(this.id, authorId, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    console.log(`[Article] Autor asociado al artículo: ${this.title}`);
                    resolve();
                });
            });
        }
    }

    // Strategy
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

    // State
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

    // SIMULACIÓN
    console.log("== [Simulación] Configurando el sistema ==");

    Notificador.suscribir(new ObservadorConsola());

    const conferencia = new Conference("ComfyChair 2025");
    const sesionAI = new Session("Inteligencia Artificial", new FixedCutoffStrategy(0.5));
    conferencia.addSession(sesionAI);

    const chair = UserFactory.createUser("Chair", "Ana Pérez", "UNLP", "ana@example.com");
    const revisor = UserFactory.createUser("Revisor", "Carlos López", "UNLP", "carlos@example.com");
    const autor = UserFactory.createUser("Autor", "María Gómez", "UBA", "maria@example.com");

    // Guardar usuarios en base de datos
    await chair.save();
    await revisor.save();
    const autorId = await autor.save();

    const articulo = new Article("Redes Neuronales en la Industria", "Regular");

    // Guardar artículo en la base de datos
    const articuloId = await articulo.save();

    // Asociar autor con artículo en la base de datos
    await articulo.addAuthor(autorId);

    articulo.addObserver(autor);

    sesionAI.articles.push(articulo);

    console.log("\n== [Simulación] Procesando transiciones de estado ==");
    sesionAI.processState(); // Recepción → Bidding
    sesionAI.processState(); // Bidding → Revisión
    sesionAI.processState(); // Revisión → Selección

    console.log("\n== [Simulación] Ejecutando proceso de selección de artículos ==");
    const aceptados = sesionAI.selectArticles();

    console.log("\n== [Simulación] Resultado final ==");
    aceptados.forEach(a => console.log(`✔ Artículo aceptado: ${a.title}`));

    console.log("=== FIN DE SIMULACIÓN ===");

    return {
        conferencia: conferencia.name,
        sesiones: conferencia.sessions.map(s => ({
            nombre: s.name,
            articulosAceptados: aceptados.map(a => a.title)
        }))
    };
};
