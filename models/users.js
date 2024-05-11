'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    iduser: Number,
    name: String,
    edad: Number,
    apellido: String,
    email: String,
    password: String,
    materias: Array
});

module.exports = mongoose.model('usuarios', UserSchema);