const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { 
    nuevoEvento,
    getEvento, 
    listarEventos,
    actualizarEvento,
    eliminarEvento
} = require('../controllers/eventos.controllers');

const router = Router();

router.get('/:id', validarJWT, getEvento);
router.get('/', validarJWT, listarEventos);
router.post('/',
    [   
        validarJWT,
        check('lat', 'La latitud es obligatoria').not().isEmpty(),
        check('lng', 'La longitud es obligatoria').not().isEmpty(),
        check('tipo', 'Es obligatorio').not().isEmpty(),
        validarCampos,        
    ] , nuevoEvento);
router.put('/:id', validarJWT, actualizarEvento);
router.delete('/:id', validarJWT, eliminarEvento);

module.exports = router;