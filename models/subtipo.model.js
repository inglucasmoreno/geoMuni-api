const { Schema, model } = require('mongoose');

const subtipoSchema = Schema({
    tipo: {
        type: Schema.Types.ObjectId,
        required: 'El tipo es obligatorio',
        trim: true
    },
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

module.exports = model('subtipo', subtipoSchema);