const { createPool } = require('mysql');

//creation of the connection pool
const pool = createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    connectionLimit: process.env.N_DB_CONN
});

module.exports = pool;