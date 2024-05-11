'use estrict'

var controller = {

    testcache: function(req, res){

        let saludos = [];

        for (let index = 0; index < 100000; index++){
            console.log("Hola soy el numero " + index);
            saludos.push("Hola soy el numero " + index);
        }

        return res.status(200).send({
            status: 200,
            message: "Test de cache",
            data: saludos
        });

    },

    fibo: function(req, res){

        let n = 10;

        //Calculo de la serie
        var fib = [0,1];
        for(var i = 2; i <= n; i++){
            fib[i] = fib[i - 1] + fib[i - 2];
        }

        return res.status(200).send({
            status: 200,
            message: "Test de Fibonacci",
            data: fib.slice(0, n + 1)
        });
    },

    factorial: function(req, res){

        const n = 15;

        // Calcular el factorial
        let result = 1;
        let process = [];
        for (let i = 2; i <= n; i++) {
            result *= i;
            process.push(result);
        }

        return res.status(200).send({
            status: 200,
            message: `Factorial de ${n}`,
            data: {
                process: process,
                factorial: result
            }
        });
    }
};

module.exports = controller;