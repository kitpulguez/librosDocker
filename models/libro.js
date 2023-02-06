const mongoose = require('mongoose');

// Definir esquema y modelo
let libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minlength: 3,
        trim: true         
    },
    editorial: {
        type: String
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    portada: {
        type: String
    }
});

let Libro = mongoose.model('libro', libroSchema);

module.exports = Libro;
