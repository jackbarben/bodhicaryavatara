require("dotenv").config();

const { Pool, Client } = require('pg')

const pool = process.env.DB_DATABASE === 'postgres' ?
    new Pool({
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        ssl: {
            require: true,
            rejectUnauthorized: false
        }

    }) :
    new Pool({
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT

    })


module.exports = { pool };