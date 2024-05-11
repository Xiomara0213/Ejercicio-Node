'use strict'

//Crear el router
const express = require('express');
const expressRedisCache = require('express-redis-cache');
const { body } = require('express-validator');
var api = express.Router();

//MIddleware
var middleware = require("../middleware/middleware");

//Controladores
var UsersController = require("../controllers/users");
var AuthController = require("../controllers/auth");
var TestCacheController = require("../controllers/cache");
var TestJobController = require("../controllers/testjob");

//Definir Cache
const cache = expressRedisCache({
    host:'redis-12282.c15.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 12282,
    auth_pass: 'jqYYSDaTXWlxKLib0VxmjH2FDqwUjWMM',
    expire: 60
});

//--------------------------RUTAS--------------------------

//Login
api.post('/login', /*Estructura de validacion*/[
    body("email").not().isEmpty(),
    body("password").not().isEmpty(),
], AuthController.login_user);

//-----------------------------CRUD de usuarios-----------------------------

//Obtener todos los usuarios
api.get('/user', middleware.userprotectUrl, UsersController.userlist);
//Obtener un usuario
api.get('/user/:iduser', middleware.userprotectUrl, UsersController.userSingular);
//Crear un usuario
api.post('/user', /*Estructura de validacion*/[
    body("iduser").not().isEmpty(),
    body("name").not().isEmpty(),
    body("apellido").not().isEmpty(),
    body("edad").not().isEmpty(),
    body("email").not().isEmpty(),
    body("password").not().isEmpty()
], UsersController.createuser);
//Actualizar un usuario
api.put('/user/:iduser', middleware.userprotectUrl, /*Estructura de validacion*/[
    body("iduser").not().isEmpty(),
    body("name").not().isEmpty(),
    body("apellido").not().isEmpty(),
    body("edad").not().isEmpty(),
    body("email").not().isEmpty(),
    body("password").not().isEmpty()
], UsersController.updateuser);
//Eliminar un usuario
api.delete('/user/:iduser', middleware.userprotectUrl, UsersController.deleteuser);

//logout
api.post('/logout', middleware.userprotectUrl, AuthController.logout);

//Defunir ruta de Cache
api.get('/testcache', cache.route(), TestCacheController.testcache);
api.get('/fibonacci', cache.route(), TestCacheController.fibo);
api.get('/factorial', cache.route(), TestCacheController.factorial);

//Test de bull
api.get('/myJob', TestJobController.myjob);

//Exportar el router
module.exports = api;