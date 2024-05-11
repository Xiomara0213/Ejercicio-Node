'use strict'

const {myJob} = require('../workers/queues');

var controller = {
    myjob: function (req, res) {

        let numeros = req.body;
        
        myJob.add(numeros);
        
        return res.status(200).send({
            status: 200,
            message: "El Job fue recibido"
        });
    }
}
module.exports = controller;