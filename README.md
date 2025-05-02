# Conferencia Backend

Les detallo la  **estructura básica con Node.js, Express y SQLite**, y el endpoint `/run-simulation` para ejecutar la lógica con los patrones que se diseñó.

>Plan de Implementación

1.  **Clases base** (Usuario, Conferencia, Sesión, Artículo, Revisión).
2.  **Factory para Usuarios y Artículos**.
3.  **Singleton a la Conferencia**.
4.  **Observer para las notificaciones**.
5.  **Usar State para manejar los cambios de estado de las sesiones**.
6.  **Strategy para la selección de artículos**.

----------

## 💻 Estructura del proyecto

```
conferencia-backend/
│
├── node_modules/
├── src/
│   ├── models/
│   │   └── (clases JS: Usuario, Articulo, etc.)
│   ├── database/
│   │   └── db.js
│   ├── routes/
│   │   └── simulation.js
│   └── app.js
├── package.json
└── server.js

```


## 🔧 Deploy

### 1. Inicializar el proyecto

```bash
cd conferencia-backend
npm init -y
npm install express sqlite3

```

### 2. Inicializar el server

```bash
node server.js
```
### 3. Simulación

```bash
http://localhost:3000/run-simulation
```





