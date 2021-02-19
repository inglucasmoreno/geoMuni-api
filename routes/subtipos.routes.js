const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { 
    nuevoSubtipo, 
    listarSubtipos,
    actualizarSubtipo,
    getSubtipo
} = require('../controllers/subtipos.controllers');

const router = Router();

router.get('/:id', validarJWT, getSubtipo);
router.get('/listar/:id', validarJWT, listarSubtipos);
router.post('/',
    [   
        validarJWT,
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
        validarCampos,        
    ] , nuevoSubtipo);
router.put('/:id', validarJWT, actualizarSubtipo);

module.exports = router;