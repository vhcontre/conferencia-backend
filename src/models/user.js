//user.js
const db = require('../database/db');

class User {
    constructor(name, affiliation, email) {
        this.name = name;
        this.affiliation = affiliation;
        this.email = email;
    }

    save() {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO users (name, affiliation, email, type) VALUES (?, ?, ?, ?)");
            stmt.run(this.name, this.affiliation, this.email, this.constructor.name, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.lastID);
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

module.exports = { User, Chair, Revisor, Autor, UserFactory };