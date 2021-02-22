const { Schema, model } = require('mongoose'); 

const eventoSchema = Schema({
    descripcion: {
        type: String,
        trim: true
    },
    lat: {  // Latitud
        type: String,
        required: 'La latitud es obligatoria',
        trim: true
    },
    lng: { // Longitud
        type: String,
        required: 'La Longitud es obligatoria',
        trim: true
    },
    tipo: {
        type: Schema.Types.ObjectId,
        ref: 'tipo'    
    },
    subtipo: {
        type: Schema.Types.ObjectId,
        ref: 'subtipo'
    },
    img: {
        type: String,
        default: 'sin-foto',
        trim: true
    },
    activo: {
        type: Boolean,
        required: 'Activo es un parametro obligatorio',
        default: true
    }    
},{ timestamps: true });

module.exports = model('evento', eventoSchema); 

