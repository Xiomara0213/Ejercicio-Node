'use strict'

const mongoose = require('mongoose');
var app = require('./app');
var port = process.env.NODEPORT;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://"+process.env.USERDATABASE+":"+process.env.PASSWORDATABASE+"@"+process.env.HOSTDATABASE+"/"+process.env.DATABASE)
        .then(() => {
            console.log("Conexión a la base de datos establecida con éxito");
            var server = app.listen(port, () => {
                console.log(`Example app listening on port ${port}`)
            });

            server.timeout = 12000;
        })
        .catch(err => console.log(err));
