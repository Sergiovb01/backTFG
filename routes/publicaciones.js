const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { crearPublicacion, obtenerPublicaciones, obtenerPublicacionPorId, obtenerMisPublicaciones, actulizarPublicacion, getPublicacionByFilter, getPublicacionesPorUsuario } = require('../controllers/publicacion');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Todas las rutas requieren JWT
router.use(validarJWT);

//Obtener publicaciones del usuario actual
router.get('/mis-publicaciones', obtenerMisPublicaciones);

// Obtener publicaciones por filtro
router.get('/filter', getPublicacionByFilter);

//Obtener publicaciones
router.get('/', obtenerPublicaciones);

// Obtener una publicación por ID
router.get('/:id', obtenerPublicacionPorId);

// Obtener publicaciones por usuario
router.get('/usuario/:userId', getPublicacionesPorUsuario);

// Crear nueva publicación
router.post(
  '/',
  [
    check('titulo').not().isEmpty().withMessage('El título es obligatorio'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria'),
    check('categoria').isArray({ min: 1 }).withMessage('Debes incluir al menos una categoría'),
    check('tipoArtista').isArray({ min: 1 }).withMessage('Debes incluir al menos un tipo de artista'),
    check('software').isArray({ min: 1 }).withMessage('Debes incluir al menos un software'),
    validarCampos
  ],
  crearPublicacion
);

//Actualizar una publicación por ID
router.put('/:id',
  [
    check('titulo').not().isEmpty().withMessage('El título es obligatorio'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria'),
    check('categoria').isArray({ min: 1 }).withMessage('Debes incluir al menos una categoría'),
    check('tipoArtista').isArray({ min: 1 }).withMessage('Debes incluir al menos un tipo de artista'),
    check('software').isArray({ min: 1 }).withMessage('Debes incluir al menos un software'),
    validarCampos
  ], actulizarPublicacion);

module.exports = router;
