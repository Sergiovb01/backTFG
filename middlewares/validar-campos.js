const {response} = require('express');
const { validationResult } = require('express-validator');



const validarCampos = (req, res = response, next) => {

    //Manejo de errores
    const errores = validationResult ( req ); //Validar si hay errores en la petición propio de Express Validator

    if(!errores.isEmpty()){ //Si errores no esta vacio lanzar error 
        return res.status(400).json({
            ok:false,
            errors: errores.mapped(),
        })
    }

    next();//Para ir pasando entre condiciones 
}

module.exports = {
    validarCampos
}