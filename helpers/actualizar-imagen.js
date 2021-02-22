const chalk = require('chalk');
const fs = require('fs');
const Evento = require('../models/evento.model');

const borrarImage = (path) => {
    if(fs.existsSync(path)){
        // Borrar la imagen anterior
        fs.unlinkSync(path);    
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    switch(tipo){
        case 'eventos':
            const evento = await Evento.findById(id);
            if(!evento){
                console.log(chalk.red('El evento no existe'));
                return false;
            }
           
            const pathViejo = `./uploads/eventos/${evento.img}`;
            borrarImage(pathViejo);
            
            evento.img = nombreArchivo;
            await evento.save();
            return true;
            
            break;

    }
}

module.exports = {
    actualizarImagen
}