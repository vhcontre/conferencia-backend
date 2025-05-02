const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./conferencia.db');

// Crear las tablas de usuarios y artículos si no existen
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            affiliation TEXT,
            email TEXT,
            type TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            type TEXT,
            score INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS article_authors (
            article_id INTEGER,
            user_id INTEGER,
            FOREIGN KEY (article_id) REFERENCES articles(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
});

module.exports = db;
