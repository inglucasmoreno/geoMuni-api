const chalk = require('chalk');
const {success, error} = require('../helpers/response');
const Subtipo = require('../models/subtipo.model');
const Evento = require('../models/evento.model');

// Nuevo subTipo
const nuevoSubtipo = async (req, res) => {
    try{   
            
        // Comprobar si el subTipo no esta repetido
        const { descripcion } = req.body;
        const subtipoBD = await Subtipo.findOne({tipo: req.body.tipo, descripcion:{ $regex: descripcion, $options:'i' }});
        if(subtipoBD) return error(res, 400, 'El subtipo ya esta registrado');
        
        // Se crea el nuevo subTipo
        const subtipo = await Subtipo(req.body).save();
        success(res, { subtipo });
    
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Subtipo por ID
const getSubtipo = async (req, res) => { 
    try{
        const id  = req.params.id;
        const subtipo = await Subtipo.findById(id, 'tipo descripcion activo');
        success(res, { subtipo });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Listar Subtipos
const listarSubtipos = async (req, res) => {
    try{
        
        // Ordenar
        let ordenar = [req.query.columna || 'descripcion', req.query.direccion || 1];
        
        // Filtrado
        const busqueda = {};
        
        busqueda.tipo = req.params.id;
        if(req.query.activo) busqueda['activo'] = req.query.activo; 
        if(req.query.descripcion){
            const regex = new RegExp(req.query.descripcion, 'i'); // Expresion regular para busqueda insensible
            busqueda.descripcion = regex;
        }

        // Paginacion
        const desde = req.query.desde ? Number(req.query.desde) : 0;
        const limit = req.query.limit ? Number(req.query.limit) : 0;

        const [subtipos, total] = await Promise.all([
            Subtipo.find(busqueda,'descripcion activo')
                .skip(desde)
                .limit(limit)
                .sort([ordenar]),
            Subtipo.find(busqueda).countDocuments()
        ]);
        success(res, { subtipos, total });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Actualizar subtipo
const actualizarSubtipo = async (req, res) => {
    try{     
        const id = req.params.id;
        const { descripcion, tipo, activo } = req.body;
        
        // Se comprueba si el subtipo a actualizar existe
        const subtipoBD = await Subtipo.findById(id);
        if(!subtipoBD) return error(res, 400, 'El subtipo no existe');
        
        if(descripcion){
            // Se determina si el subtipo a actualizar esta repetido
            if(descripcion.toUpperCase() != subtipoBD.descripcion.toUpperCase() && descripcion){
                const subtipoRepetido = await Subtipo.findOne({tipo, descripcion: { $regex: descripcion, $options: 'i'}});
                if(subtipoRepetido) return error(res, 400, 'El tipo ya existe');
            }
        }
        
        if(activo == false || activo == 'false'){
            
            // Se comprueba si hay eventos con este subtipo antes de inhabilitar
            const existeEvento = await Evento.findOne({ subtipo: id, activo: true });
            if(existeEvento) return error(res, 400, 'Existen eventos activos asociados con este subtipo');
        
            // Se comprueba si es el unico subtipo habilitado para el tipo en cuestion
            const unicoSubtipo = await Subtipo.find({ tipo, activo: true });
            if(unicoSubtipo.length < 2) return error(res, 400, 'La cantidad de subtipos no puede ser cero');
        
        }

        

        // Se actualiza el tipo
        const nuevoSubtipo = await Subtipo.findByIdAndUpdate(id, req.body, {new: true});       
        success(res, nuevoSubtipo);

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

module.exports = {
    nuevoSubtipo,
    listarSubtipos,
    getSubtipo,
    actualizarSubtipo
}