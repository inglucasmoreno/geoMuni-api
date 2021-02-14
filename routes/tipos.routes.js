const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { 
    nuevoTipo, 
    listarTipos, 
    getTipo, 
    actualizarTipos 
} = require('../controllers/tipos.controllers');

const router = Router();

router.get('/:id', validarJWT, getTipo);
router.get('/', validarJWT, listarTipos);
router.post('/',
    [   
        validarJWT,
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
        validarCampos,        
    ] , nuevoTipo);
router.put('/:id', validarJWT, actualizarTipos)

module.exports = router;