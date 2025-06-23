const path = require('path');
const express = require('express');
const { dbConection } = require('./database/config');
const cors = require('cors');
require('dotenv').config()


//Crear el servidor de express
const app = express();

//Base de datos 
dbConection()

//CORS
app.use(cors())//Esto permite que cualquier origen (frontend) haga peticiones a tu API

//Directorio Público 
app.use(express.static('public')) ;//Middleware (operación que se ejecuta cuando alguien hace una petición en mi servidor )

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/perfil', require('./routes/perfil'));
app.use('/api/publicaciones', require('./routes/publicaciones'));
app.use('/api/postulaciones', require('./routes/postulacion'));
app.use('/api/usuarios', require('./routes/usuarios'));


app.get('/*path', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Escuchar peticiones 
app.listen(process.env.PORT, () => { //coger el puerto de las variables de entorno
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

