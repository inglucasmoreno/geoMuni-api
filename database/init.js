require('dotenv').config();
const mongoose = require('mongoose');
const brcrypt = require('bcryptjs');
const chalk = require('chalk');
const Usuario = require('../models/usuario.model');
const Tipo = require('../models/tipo.model'); 

// Funcion: Inicializacion de Base de datos
const initialization = async () => {
    try{
        // Conexion con base de datos
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/geoEventos',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false              
        });
        console.log(chalk.green('[Equinoccio Technology]') + ' - Conexion a base de datos correcta');   
        await userAdmin();  
        console.log(chalk.green('[Equinoccio Technology]') + ' - Inicializacion completada');     
    }catch(err){
        console.log(err);
        throw new Error('Error al inicializar la base de datos');    
    }     
}

// Inicializacion de usuario administrador
const userAdmin = async () => {
    const data = {
        dni: 'admin',
        apellido: 'Admin',
        nombre: 'Admin',
        email: 'admin@gmail.com',
        role: 'ADMIN_ROLE',
        activo: true
    }
    
    // Generacion de password encriptado
    const salt = brcrypt.genSaltSync();
    data.password = brcrypt.hashSync('admin', salt);

    // Se crea y se almacena en la base de datos al usuario administrador
    const usuario = new Usuario(data);
    await usuario.save();
    console.log(chalk.green('[Equinoccio Technology]') + ' - Usuario administrador creado');
    console.log(chalk.green('[Equinoccio Technology]') + ' - Usuario: admin | Password: admin');
}


// Ejecucion de la funcion
initialization();