const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const usuarioSchema = new Schema({
    dni: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    activo: {
        type: Boolean,
        required: true,
        default: true
    }
}, {timestamps: true});

usuarioSchema.plugin(mongoosePaginate);

usuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('usuario', usuarioSchema);