const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { seguirUsuario, dejarDeSeguir, getSeguidoresYSeguidos, agregarFavorito, eliminarFavorito, obtenerFavoritos } = require('../controllers/usuario');


const router = Router();


//Segurir a un usuario
router.post('/seguir/:id', validarJWT, seguirUsuario);

//Dejar de seguir a un usuario
router.post('/dejar-de-seguir/:id', validarJWT, dejarDeSeguir);

//Agregar publicación a favoritos
router.post('/favoritos/:idPublicacion', validarJWT, agregarFavorito);

// Obtener seguidores y seguidos
router.get('/seguidores-seguidos', validarJWT, getSeguidoresYSeguidos);

// Obtener publicaciones favoritas
router.get('/favoritos', validarJWT, obtenerFavoritos);

// Eliminar publicación de favoritos
router.delete('/favoritos/:idPublicacion', validarJWT, eliminarFavorito);

module.exports = router;
