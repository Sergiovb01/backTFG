/*
    Event Routes
    host + /api/auth

*/
const {Router} = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");


const router = Router();

//Todos tiene que pasar por la validación del JWT
router.use(validarJWT);

//CRUD

//Obtener eventos 
router.get('/', getEventos);

//Crear un nuevo eventos 
router.post(
    '/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha final es obligatoria').custom(isDate),
        validarCampos //Nuestro custom middleware para validar los campos
    ],
     crearEvento);

//Actualizar Evento
router.put(
    '/:id',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha final es obligatoria').custom(isDate),
        validarCampos //Nuestro custom middleware para validar los campos
    ],
     actualizarEvento);

//Borrar Evento
router.delete('/:id', eliminarEvento);

module.exports = router