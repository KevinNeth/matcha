const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const flash = require('express-flash');
const io = require('socket.io').listen(server);

const session = require('express-session')({
    secret: 'balek',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});
const sharedSession = require("express-socket.io-session");

//Moteur de template
app.set("view engine", "ejs");

// Definie le dossier static
app.use(express.static('public'));

// Parse les information recu
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session);
io.use(sharedSession(session));

// Middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});
require('./controllers/notifications')(io);

// io.on('connection', (socket) => {
//     console.log("A user connected.");
//     console.log(socket);
// });

//Routes de base
app.use('/', require("./routes/signUp"));
app.use('/login', require("./routes/logIn"));
app.use('/forgotpass', require("./routes/forgotPass"));
app.use('/reset', require("./routes/reset"));
app.use('/home', require("./routes/home"));
app.use('/firstConnection', require("./routes/firstConnection"));
app.use('/settings', require("./routes/settings"));
app.use('/disconnections', require("./routes/disconnections"));
app.use('/chat', require("./routes/chat"));
app.use('/profile', require("./routes/profile"));
app.use('/myaccount', require("./routes/myaccount"));

server.listen(8080);
console.log("Listening...");