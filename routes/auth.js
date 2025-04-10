
// Rutas de Usuarios / Auth
// host + /api/auth

const {Router} = require('express');
const router = Router();
const { check } = require('express-validator');

const {crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth'); 
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



//ENDPOINTS

router.post(
    '/new',
     [//Colección de middlewares de validación de peticiones (Reglas de validación)
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser mínimo de 6 caracteres').isLength({min: 6}),
        validarCampos //Nuestro custom middleware para validar los campos 


     ],
    crearUsuario);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser mínimo de 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario);

router.get('/renew',validarJWT, revalidarToken);



module.exports= router; //Exportación en node 