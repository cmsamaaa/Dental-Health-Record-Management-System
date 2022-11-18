const db = require('knex');

const connectedKnex = db({
    client: 'mysql2',
    connection: {
        host : process.env.DB_HOSTNAME,
        port : process.env.DB_PORT,
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_DATABASE
    },
    useNullAsDefault: true
});

module.exports = connectedKnex;