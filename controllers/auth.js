'use strict'

require('dotenv').config();
var jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

var Users = require('../models/users');
var Sessions = require('../models/accesstoken');

var controller = {

    login_user: function(req, res){

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({status:400, errors: errors.array()});
        }

        var data = req.body;

        Users.findOne({email:data.email})
        .then(usuarios => {

            // bcrypt
            bcrypt.compare(data.password, usuarios.password, function(err, result) {
                // resultado == verdadero
                if(result){
                
                    const payload = {
                        user: usuarios
                    }
                    
                    let access_token = jwt.sign(payload, process.env.KEY, {
                        expiresIn: '1d'
                    });
    
                    let today = new Date().toISOString();
    
                    let update_session = {
                        user: usuarios.email,
                        key: access_token,
                        creationDate: today,
                        expirationDate: '1d',
                        active: true
                    }
                    Sessions.findOneAndUpdate({user: usuarios.email}, update_session, {upsert: true, new: true})
                    .then(session => {
                        if(!session){
                            return res.status(401).send({
                                status:401,
                                message:"Usuario no encontrado"
                            });
                        }            
                        return res.status(200).send({
                            status:200,
                            message:"Login correcto",
                            token: access_token
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(500).send({
                            status:500,
                            message:"Error detectado"
                        });
                    });
                }else{
                    return res.status(401).send({
                        status:401,
                        message:"Datos no válidos"
                    });
                }
            });            
        })
        .catch(error => {
            console.error(error);
            return res.status(401).send({
                status:401,
                message:"Datos no válidos"
            });
        });
    },

    logout: async function(req, res) {
               
        //console.log(req.decoded);
        try{
            const sessionDeleted = await Sessions.findOneAndDelete({ user: req.decoded.user }).exec();
            if(!sessionDeleted) return res.status(404).send({message:"Datos erroneos"});

            return res.status(200).send({
                message:"Sesion finalizada"
            });
        } catch {
            return res.status(500).send({ message: err });
        }
    }

}


module.exports = controller;