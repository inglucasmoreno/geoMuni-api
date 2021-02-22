const { supportsColor } = require('chalk');
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

        // Filtrado por condicion
        const busqueda = {};
        if(req.query.activo) busqueda['activo'] = req.query.activo;
        if(req.query.tipo) busqueda['tipo'] = req.query.tipo;
        if(req.query.descripcion){
            const regex = new RegExp(req.query.descripcion, 'i'); // Expresion regular para busqueda insensible
            busqueda['descripcion'] = regex;
        } 
        
        // Paginacion
        const desde = req.query.desde ? Number(req.query.desde) : 0;
        const limit = req.query.limit ? Number(req.query.limit) : 0;

        const [eventos, total] = await Promise.all([
            Evento.find(busqueda, 'descripcion activo tipo lat lng img createdAt')
                .skip(desde)
                .limit(limit)
                .populate({
                    path: 'tipo',
                    select: 'activo descripcion',
                })
                .populate({
                    path: 'subtipo',
                    select: 'activo descripcion',
                })
                .sort({createdAt: -1}),         
            Evento.find(busqueda).countDocuments()
        ]);
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
