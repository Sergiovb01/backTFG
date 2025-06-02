const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { crearPerfil, getPerfil, getPerfiles } = require('../controllers/perfil');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

// Todos deben pasar por el middleware JWT
router.use(validarJWT);

//Obtener perfil
router.get('/mi-perfil', getPerfil);

//Obtener perfiles
router.get('/', getPerfiles);

// Crear nuevo perfil
router.post(
  '/',
  [
    check('softwares').isArray({ min: 1 }).withMessage('El campo softwares es obligatorio y debe tener al menos un elemento'),
    check('skills').isArray({ min: 1 }).withMessage('El campo skills es obligatorio y debe tener  al menos un elemento'),
    check('country').not().isEmpty().withMessage('El país es obligatorio'),
    check('city').not().isEmpty().withMessage('La ciudad es obligatoria'),
    check('about').not().isEmpty().withMessage('La descripción es obligatoria'),
    check('socialMedia.*.account').isString().withMessage('Cada red social debe tener un nombre de cuenta válido'),
    // check('photo').isURL().withMessage('La URL de la foto es obligatoria y debe ser válida'),

    validarCampos
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  crearPerfil
);

module.exports = router;