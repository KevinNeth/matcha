let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');

//Variable des middleware.
let signUp = require("./routes/signUp");
let logIn = require("./routes/logIn");
let forgotPass = require("./routes/forgotPass");
let reset = require("./routes/reset");
let home = require("./routes/home");
let firstConnection = require("./routes/firstConnection");
let settings = require("./routes/settings");
let disconnections = require("./routes/disconnections");

//Moteur de template
app.set("view engine", "ejs");

// Middleware

// Definie le dossier static
app.use(express.static('public'));

// Parse les information recu
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'balek',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

//Route
app.use('/', signUp);
app.use('/login', logIn);
app.use('/forgotpass', forgotPass);
app.use('/reset', reset);
app.use('/home', home);
app.use('/firstConnection', firstConnection);
app.use('/settings', settings);
app.use('/disconnections', disconnections);





app.listen(8080);
