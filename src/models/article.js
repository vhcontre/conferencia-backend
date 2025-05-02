//article.js
const db = require('../database/db');

class Article {
    constructor(title, type) {
        this.title = title;
        this.type = type;
        this.authors = [];
        this.observers = [];
        this.score = 10;
        console.log(`[Article] Artículo creado: ${title} (${type})`);
    }

    save() {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO articles (title, type, score) VALUES (?, ?, ?)");
            stmt.run(this.title, this.type, this.score, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.lastID);
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

module.exports = Article;