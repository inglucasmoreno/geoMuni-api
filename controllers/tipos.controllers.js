const chalk = require('chalk');
const {success, error} = require('../helpers/response');
const Tipo = require('../models/tipo.model');

// Nuevo tipo
const nuevoTipo = async (req, res) => {
    try{   
       
        // Comprobar si el tipo no esta repetido
        const { descripcion } = req.body;
        const tipoBD = await Tipo.findOne({descripcion:{ $regex: descripcion, $options:'i' }});
        if(tipoBD) return error(res, 400, 'El tipo ya esta registrado');
        
        // Se crea el nuevo tipo
        const tipo = await Tipo(req.body).save();
        success(res, { tipo });
    
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Tipo por ID
const getTipo = async (req, res) => { 
    try{
        const id  = req.params.id;
        const tipo = await Tipo.findById(id, 'descripcion activo');
        success(res, tipo);
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Listar tipos
const listarTipos = async (req, res) => {
    try{
        const [tipos, total] = await Promise.all([
            Tipo.find({},'descripcion activo').sort({ descripcion: 1 }),
            Tipo.find().countDocuments()
        ]);
        success(res, { tipos, total });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Actualizar tipos
const actualizarTipos = async (req, res) => {
    try{     
        const id = req.params.id;
        const { descripcion } = req.body;
        
        // Se comprueba si el tipo a actualizar existe
        const tipoBD = await Tipo.findById(id);
        if(!tipoBD) return error(res, 400, 'El tipo no existe');

        // Se determina si el tipo a actualizar esta repetido
        if(descripcion.toUpperCase() != tipoBD.descripcion.toUpperCase() && descripcion){
            const tipoRepetido = await Tipo.findOne({descripcion: { $regex: descripcion, $options: 'i'}});
            if(tipoRepetido) return error(res, 400, 'El tipo ya existe');
        }

        // Se actualiza el tipo
        const nuevoTipo = await Tipo.findByIdAndUpdate(id, req.body, {new: true});       
        success(res, nuevoTipo);

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

module.exports = {
    nuevoTipo,
    listarTipos,
    getTipo,
    actualizarTipos
}