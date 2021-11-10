const mariadb = require('mariadb/callback');

const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTIONLIMIT
};

const pool = mariadb.createPool(options);


module.exports = pool;
