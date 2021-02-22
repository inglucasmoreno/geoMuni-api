const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const {success, error} = require('../helpers/response');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

// Subir imagen
const fileUpload = (req, res) => {

    let sampleFile;
    let uploadPath;

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Se valida si el tipo esta permitido
    const tiposValidos = ['eventos'];
    if(!tiposValidos.includes(tipo)){
        return error(res, 400, 'El tipo es invalido');
    }

    // Se valida si hay un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return error(res, 400, 'No hay ningun archivo');
    }

    // Validar extension
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if(!extensionesValidas.includes(extensionArchivo))
        return error(res, 400, 'Extension de imagen invalida');

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Mover la imagen
    file.mv(path, (err) => {
    if (err){
        console.log(charlk.red(err));
        return error(res, 400, 'Error al mover la imagen');
    }
    
    // Actualizar base de datos
    actualizarImagen(tipo, id, nombreArchivo);

    success(res, { 
        ok: true,
        nombreArchivo 
    });
    
  });

}

// Mostrar imagen
const retornarImagen = (req, res) => {
    const {tipo, foto} = req.params;
    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const noImagePath= path.join(__dirname, `../uploads/sin-foto.png`);
        res.sendFile(noImagePath);
    }

}

module.exports = {
    fileUpload,
    retornarImagen
}