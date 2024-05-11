'use strict';

require('dotenv').config();
var jwt = require("jsonwebtoken");

//var Sessions = require('../models/accesstoken');

var middleware = {

    /*userprotectUrl: function(req, res, next){

        const token = req.headers.authorization;

        if (token) {
            
            jwt.verify(token, process.env.KEY, (err, decodedToken) => {
                console.log(decodedToken);
                if (err) {
                    return res.status(401).send({ 
                        status: 401,
                        message: "Token no valido" 
                    });
                } else {

                    req.decoded = decodedToken;

                    Sessions.findOne({user:req.decodedToken.user.email, key: token, active: true})
                    .then(session => {
                        if(!session) {
                            return res.status(401).send({
                                status:401,
                                message: "Sesion no encontrada"
                            });
                        }
                        next();
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(500).send({
                            status:500,
                            message: "Error detectado"
                        });
                    });
                    
                }
            });
        }
    }*/

    userprotectUrl: function(req, res, next){

        return new Promise((resolve, reject) => {
            const token = req.headers.authorization;
        
            if (!token) {
                reject({
                    status: 401,
                    message: "Token de autenticacion no proporcionado",
                });
            }
            jwt.verify(token.split(" ")[1], process.env.KEY, (error, decodedToken) => {
                if (error) {
                    reject({ 
                        status: 401,
                        message: "Token de autenticacion no valido" 
                });
                } else {
                    req.decoded = decodedToken; 
                    resolve();
                }
            })
        })
        .then(() => next())
        .catch((error) =>
        res.status(error.status || 500).json({ message: error.message })
        )
    }

};

module.exports = middleware;