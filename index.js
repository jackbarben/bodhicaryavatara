const express = require('express');
const app = express();
const { pool } = require('./utils/databaseConfig')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session');
require('dotenv').config()
const path = require('path')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const pgSession = require('connect-pg-simple')(session);
const ExpressError = require('./utils/ExpressError')

let fullDictionary

const initializePassport = require('./utils/passportConfig')

initializePassport(passport)

const morgan = require('morgan')
app.use(morgan('tiny'))





app.set('view engine', 'ejs');



app.set('views', path.join(__dirname, 'views'))

const parseVerseNoDatabase = require('./utils/parseVerseNoDatabase')
const catchAsync = require('./utils/catchAsync')
const dictionary = require('./routes/dictionary')
const verse = require('./routes/verses')
const bodhicarya = require('./routes/bodhicarya')
const users = require('./routes/users')

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));







const sessionMiddleware = {
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionMiddleware))

const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate)



app.use(flash())
app.use(passport.initialize())
app.use(passport.session())



app.use((req, res, next) => {

    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash("error");
    next()
})



app.use('/dictionary', dictionary)
app.use('/verse', verse)
app.use('/', bodhicarya)
app.use('/users', users)






const admin = io.of('/admin')
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.of('/admin').use(wrap(sessionMiddleware));
io.of('/admin').use(wrap(passport.initialize()));
io.of('/admin').use(wrap(passport.session()));



io.of('/admin').use((socket, next) => {
    if (socket.request.user) {
        console.log('middleware socket')
        next();
    } else {
        next(new Error('unauthorized'))
    }
});



io.on('connection', (socket) => {
    console.log(`new connection on main server`);
    socket.on('dictionary', (async(msg) => {

        const removeSpace = msg.replace(/\s+/g, '')
        const removeGShas = removeSpace.replace('།', '་')
        const clickedWord = removeGShas.replace('༎', '་')
        let lookup
        if (clickedWord.slice(-1) === '་') {
            lookup = await pool.query(`SELECT * FROM dictionary WHERE '${clickedWord}' = ANY (alternate)`)
        } else {
            lookup = await pool.query(`SELECT * FROM dictionary WHERE '${clickedWord.concat('་')}' = ANY (alternate)`)
        }

        const addA = clickedWord.concat('འ་')
        const checkA = await pool.query(`SELECT * FROM dictionary WHERE '${addA}' = ANY (alternate)`)

        if (lookup.rowCount > 0) {

            io.emit('dictionary', lookup.rows, lookup.rows[0].tibetan);
        } else if (checkA.rowCount > 0) {
            lookup = checkA
            io.emit('dictionary', lookup.rows, addA);
        } else {
            console.log('Couldn\'t find the word')
        }
    }));


    socket.on('seeAlso', (async(msg) => {
        const removeSpace = msg.replace(/\s+/g, '')
        const lookup = await pool.query(`SELECT * FROM dictionary WHERE '${removeSpace}' = ANY (alternate)`)

        io.emit('seeAlso', lookup.rows, msg);
    }))
});


admin.on('connect', (socket) => {
    socket.on('whoami', (cb) => {
        cb(socket.request.user ? socket.request.user.username : '');
    });

    const session = socket.request.session;
    console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });

})

//error handling
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found"), 404)
})


app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong.' } = err;
    if (!err.message) {
        err.message = 'Something went wrong.'
    }
    res.status(statusCode).render('error', { err })


})


//starting server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`listening on ${port}`);
});