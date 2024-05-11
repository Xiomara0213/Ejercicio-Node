'use strict'

const bcrypt = require('bcrypt');
var Users = require('../models/users');

module.exports = async(job, done) => {
    try{

        let data = job.data;

        //usuario existente
        Users.findOne({iduser:data.iduser})
        .then(usuarios => {

            //Validacion de usuario duplicado
            if(usuarios){
                return done(new Error('Usuario existente'));
            }

            //Crypt de password
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err,salt){
                bcrypt.hash(data.password, salt, function(err, hash){
                    // Almacena el hash en tu base de datos de contraseña
                    var create_user = new Users();
                    create_user.iduser = data.iduser;
                    create_user.name = data.name;
                    create_user.edad = data.edad;
                    create_user.apellido = data.apellido;
                    create_user.email = data.email;
                    create_user.materias = data.materias;
                    create_user.password = hash;

                    create_user.save()
                    .then(result => {
                        job.progress(100);
                        return done(null, result);
                    })
                    .catch(error => {
                        return done(error);
                    })
                });
            });
        })
        .catch(error => {
            return done(error);
        });

    } catch(error) {
        return done(error);
    }
}

