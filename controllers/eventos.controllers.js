const mongoose = require('mongoose');
const chalk = require('chalk');
const {success, error} = require('../helpers/response');
const Evento = require('../models/evento.model');

// Crear nuevo evento
const nuevoEvento = async (req, res) => {
    try{
        const evento = await Evento(req.body).save();
        success(res, { evento });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Evento por ID
const getEvento = async (req, res) => {
    try{
        const id = req.params.id;
        const evento = await Evento.findById(id)
                                   .populate('tipo', 'descripcion')
                                   .populate({
                                        path: 'subtipo',
                                        select: 'activo descripcion',
                                    })
        success(res, { evento })
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Listar eventos
const listarEventos = async (req, res) => {
    try{

        // Busqueda para calcular total
        const busqueda = {};

        // Pipeline para Aggregate
        let pipeline = [];

        // Etapa 1 - Filtrado por Descripcion
        if(req.query.descripcion){
            const regex = new RegExp(req.query.descripcion, 'i'); // Expresion regular para busqueda insensible
            pipeline.push({$match: {descripcion: regex}});
            busqueda['descripcion'] = regex;
        } 
        
        // Etapa 2 - Filtrado port activo/inactivo
        if(req.query.activo == 'true'){
            pipeline.push({$match: { activo: true }});
            busqueda['activo'] = true;
        }else if(req.query.activo == 'false'){
            pipeline.push({$match: { activo: false }}); 
            busqueda['activo'] = false;
        }

        // Etapa 3 - Join (Tipos y Subtipos)     
        pipeline.push(
            { $lookup: { // Lookup - Tipos
                from: 'tipos',
                localField: 'tipo',
                foreignField: '_id',
                as: 'tipo'
            }},
        );

        pipeline.push(
            { $lookup: { // Lookup - Subtipos
            from: 'subtipos',
            localField: 'subtipo',
            foreignField: '_id',
            as: 'subtipo'
            }}
        );

        pipeline.push({ $unwind: '$tipo' });
        pipeline.push({ $unwind: '$subtipo' });

        
        // Etapa 4 - Filtrado por tipo
        if(req.query.tipo) {
            pipeline.push({$match: { 'tipo._id': mongoose.Types.ObjectId(req.query.tipo) }});
            busqueda['tipo'] = req.query.tipo;
        };

        // Etapa 5 -  Paginacion - (Ultima etapa del Pipeline siempre)
        const desde = req.query.desde ? Number(req.query.desde) : 0;
        const limit = req.query.limit ? Number(req.query.limit) : 0;       
        if(limit != 0) pipeline.push({$limit: limit});
        pipeline.push({$skip: desde});

        // Etapa 6 - Ordenando datos
        const ordenar = {};
        ordenar[req.query.columna] = Number(req.query.direccion); 
        pipeline.push({$sort: ordenar});

        // Ejecución de consultas
        const [eventos, total] = await Promise.all([           
            Evento.aggregate(pipeline),
            Evento.find(busqueda).countDocuments()
        ],)

        success(res, { eventos, total });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Actualizar evento
const actualizarEvento = async (req, res) => {
    try{
        const id = req.params.id;
        
        // Existe el evento a actualizar?
        const eventoExiste = await Evento.findById(id);
        if(!eventoExiste) return error(res, 400, 'El evento ha actualizar no existe'); 

        // Actualizar evento
        const nuevoEvento = await Evento.findByIdAndUpdate(id, req.body, {new: true});
        success(res, { nuevoEvento });
        
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
} 

// Eliminar eventos
const eliminarEvento = async (req, res) => {
    try{
        const id = req.params.id;
        const existeEvento = await Evento.findById(id);
        if(!existeEvento) error(res, 400, 'No existe el evento');
        
        // Eliminar evento
        const eventoEliminado = await Evento.findByIdAndDelete(id);
        success(res, { eventoEliminado });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

module.exports = {
    nuevoEvento,
    getEvento,
    listarEventos,
    actualizarEvento,
    eliminarEvento
}
