const { Router } = require('express');
const { check } = require('express-validator');
const expressFileUpload = require('express-fileupload');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { 
    fileUpload,
    retornarImagen
} = require('../controllers/uploads.controllers');

const router = Router();
router.use(expressFileUpload());

router.get('/:tipo/:foto', retornarImagen);
router.put('/:tipo/:id', validarJWT, fileUpload);

module.exports = router;