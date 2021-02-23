const chalk = require('chalk');
const {success, error} = require('../helpers/response');
const Tipo = require('../models/tipo.model');
const Evento = require('../models/evento.model');
const Subtipo = require('../models/subtipo.model');

// Nuevo tipo
const nuevoTipo = async (req, res) => {
    try{   
       
        // Comprobar si el tipo no esta repetido
        const { descripcion } = req.body;
        const tipoBD = await Tipo.findOne({descripcion:{ $regex: descripcion, $options:'i' }});
        if(tipoBD) return error(res, 400, 'El tipo ya esta registrado');
        
        // Se crea el nuevo tipo
        const tipo = await Tipo(req.body).save();
        
        // Se crea el subtipo inicial - Se llama igual que el tipo
        const subtipo = new Subtipo({
            tipo: tipo._id, 
            descripcion
        });
        
        await subtipo.save();
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
        success(res, { tipo });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Listar tipos
const listarTipos = async (req, res) => {
    try{
        const busqueda = {};
        if(req.query.activo) busqueda['activo'] = req.query.activo; 
        if(req.query.descripcion){
            const regex = new RegExp(req.query.descripcion, 'i'); // Expresion regular para busqueda insensible
            busqueda.descripcion = regex;
        }

        // Paginacion
        const desde = req.query.desde ? Number(req.query.desde) : 0;
        const limit = req.query.limit ? Number(req.query.limit) : 0;

        const [tipos, total] = await Promise.all([
            Tipo.find(busqueda,'descripcion activo')
                .skip(desde)
                .limit(limit)
                .sort({ descripcion: 1 }),
            Tipo.find(busqueda).countDocuments()
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
        const { descripcion, activo } = req.body;
        if(descripcion){
            // Se comprueba si el tipo a actualizar existe
            const tipoBD = await Tipo.findById(id);
            if(!tipoBD) return error(res, 400, 'El tipo no existe');
    
            // Se determina si el tipo a actualizar esta repetido
            if(descripcion.toUpperCase() != tipoBD.descripcion.toUpperCase() && descripcion){
                const tipoRepetido = await Tipo.findOne({descripcion: { $regex: descripcion, $options: 'i'}});
                if(tipoRepetido) return error(res, 400, 'El tipo ya existe');
            }
        }

    
        // Se comprueba si hay eventos con este tipo antes de inhabilitar
        if(activo == false || activo == 'false'){
            const existeEvento = await Evento.findOne({ tipo: id, activo: true });
            if(existeEvento) return error(res, 400, 'Existen eventos activos asociados con este tipo');
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