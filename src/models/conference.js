//conference.js
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

module.exports = Conference;