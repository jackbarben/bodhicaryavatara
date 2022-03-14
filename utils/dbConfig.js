require("dotenv").config();

const { Pool, Client } = require('pg')




const pool = process.env.DB_HOST === 'bodhi.cemgkvzbi9oy.us-east-1.rds.amazonaws.com' ?
    new Pool({
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        port: process.env.DB_PORT,
        secret: process.env.SESSION_SECRET,
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
        port: process.env.DB_PORT,
        secret: process.env.SESSION_SECRET
    })

module.exports = { pool };