const { Router } = require('express');
const { crearPostulacion, obtenerPostulacionesRecibidas, eliminarPostulacion } = require('../controllers/postulacion');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Crear postulación
router.post('/', validarJWT, crearPostulacion);

// Obtener postulaciones de un usuario
router.get('/recibidas/mis-proyectos', validarJWT, obtenerPostulacionesRecibidas);

//Eliminar postulación 
router.delete('/:id', validarJWT, eliminarPostulacion);

module.exports = router;