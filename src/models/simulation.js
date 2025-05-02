// filepath: c:\Users\Omen\source\repos\conferencia-backend\src\models\simulation.js
const { Notificador, ObservadorConsola } = require('./observer');
const Conference = require('./conference');
const { UserFactory } = require('./user');
const Article = require('./article');
const { Session, FixedCutoffStrategy } = require('./session');

module.exports = async function runSimulation() {
    console.log("=== INICIO DE SIMULACIÓN ===");

    // Configuración del sistema
    Notificador.suscribir(new ObservadorConsola());

    const conferencia = new Conference("ComfyChair 2025");
    const sesionAI = new Session("Inteligencia Artificial", new FixedCutoffStrategy(0.5));
    conferencia.addSession(sesionAI);

    const chair = UserFactory.createUser("Chair", "Ana Pérez", "UNLP", "ana@example.com");
    const revisor = UserFactory.createUser("Revisor", "Carlos López", "UNLP", "carlos@example.com");
    const autor = UserFactory.createUser("Autor", "María Gómez", "UBA", "maria@example.com");

    await chair.save();
    await revisor.save();
    const autorId = await autor.save();

    const articulo = new Article("Redes Neuronales en la Industria", "Regular");
    const articuloId = await articulo.save();
    await articulo.addAuthor(autorId);

    articulo.addObserver(autor);
    sesionAI.articles.push(articulo);

    sesionAI.processState();
    sesionAI.processState();
    sesionAI.processState();

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