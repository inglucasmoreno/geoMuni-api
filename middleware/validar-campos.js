const { validationResult } = require('express-validator');
const { error } = require('../helpers/response');

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return error(res, 400, {
            errors: errores.mapped() // Podria ser tambien -> array()
        });
    }
    next(); // Continua si no hay errores -> [Express-Validator]
}

module.exports = {
    validarCampos
}