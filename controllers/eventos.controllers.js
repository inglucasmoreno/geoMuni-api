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
        const evento = await Evento.findById(id);
        success(res, { evento })
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Listar eventos
const listarEventos = async (req, res) => {
    try{
        const [eventos, total] = await Promise.all([
            Evento.find({}, 'descripcion activo tipo lat lng fotoUrl')
                  .populate('tipo','descripcion'),
            Evento.find().countDocuments()
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

module.exports = {
    nuevoEvento,
    getEvento,
    listarEventos,
    actualizarEvento
}
