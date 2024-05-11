'use strict'

const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

var Users = require('../models/users');

const { userJob } = require('../workers/queues');

var controller = {
    //Obtener todos los usuarios
    userlist: function(req, res){

        Users.find({})
        .then(usuarios => {
            return res.status(200).send({
                status:200,
                message:" Usuarios listados",
                data:usuarios
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                status:500,
                message:"Error detectado"
            });
        });

    },
    //Obtener un usuario
    userSingular: function(req, res){

        var params = req.params;
        var iduser = params.iduser;

        Users.findOne({iduser:parseInt(iduser)})
        .then(usuarios => {
            return res.status(200).send({
                status:200,
                message:"Información de usuario",
                data:usuarios
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                status:500,
                message:"Error detectado"
            });
        });
    },
    //Crear un usuario
    createuser: function(req, res){

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({status:400, errors: errors.array()});
        }

        var data =req.body;
        userJob.add(data);

        return res.status(200).send({
            status:200,
            message:"Usuario recibido"
        });
        
    },
    //Actualizar un usuario
    updateuser: function(req, res){

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({status:400, errors: errors.array()});
        }

        var params = req.params;
        var iduser = params.iduser;

        var data =req.body;

        //Crypt de password
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err,salt){
            bcrypt.hash(data.password, salt, function(err, hash){
                // Almacena el hash en tu base de datos de contraseña
                var update_user = {
                    iduser: data.iduser,
                    name: data.name,
                    edad: data.edad,
                    apellido: data.apellido,
                    email: data.email,
                    password: hash,
                    materias: data.materias,
                }
        
                Users.findOneAndUpdate({iduser:parseInt(iduser)}, update_user)
                .then(usuarios => {
        
                    if(!usuarios){
                        return res.status(200).send({
                            status:200,
                            message:"Usuario no encontrado"
                        });
                    }
        
                    return res.status(200).send({
                        status:200,
                        message:"Usuario actualizado"
                    });
                })
                .catch(error => {
                    console.error(error);
                    return res.status(500).send({
                        status:500,
                        message:"Error detectado"
                    });
                });
            });
        });
    },
    //Borrar usuarios
    deleteuser: function(req, res){
        var params = req.params;
        var iduser = params.iduser;

        Users.findOneAndDelete({iduser:parseInt(iduser)})
        .then(usuarios => {

            if(!usuarios){
                return res.status(200).send({
                    status:200,
                    message:"Usuario no encontrado"
                });
            }

            return res.status(200).send({
                status:200,
                message:"Usuario eliminado"
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                status:500,
                message:"Error detectado"
            });
        });
    }

};

module.exports = controller;