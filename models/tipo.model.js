const { Schema, model } = require('mongoose');

const tipoSchema = Schema({
    descripcion: {
        type: String,
        required: 'La descripcion es obligatoria',
        trim: true        
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = model('tipo', tipoSchema);