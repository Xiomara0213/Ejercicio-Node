'use strict'

let redis = {
    host:'redis-12282.c15.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 12282,
    password: 'jqYYSDaTXWlxKLib0VxmjH2FDqwUjWMM'
};

const {
    myJob: myJobWorker,
    userJob: userJobWorker
} = require('./workers');

const Queue = require('bull');
const myJob = new Queue('myJob', {redis});
const userJob = new Queue('userJob', {redis});


myJob.process(1, (job, done) => myJobWorker(job, done));
userJob.process(1, (job, done) => userJobWorker(job, done));

const queues = [
    {
        name: 'myJob',
        hostId: 'Job de test de configuracion',
        redis
    },
    {
        name: 'userJob',
        hostId: 'Job de creacion de usuarios',
        redis
    }
];

module.exports = {
    myJob,
    userJob,
    queues
}