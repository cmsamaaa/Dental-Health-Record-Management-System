const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const logger = require('morgan');


const defaultController = require('./controllers/defaultController');

// routers
const frontendRoutes = require('./routes/frontend');
const backendRoutes = require('./routes/backend');
const apiRoutes = require('./routes/api');

let PORT = 3000;
if (process.env.ENV !== "test")
    PORT = process.env.PORT || 3000;
else
    PORT = process.env.PORT || 3001;

// init app
const app = express();

// load view engine
app.set('views', path.join(__dirname, 'boundaries'));
app.set('view engine', 'ejs');

// serve css & js
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/css', express.static(path.join(__dirname, 'public/css')));
// app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// middleware
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(session({
    secret: "tempPass123",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(cookieParser());

// middleware logger
if (process.env.ENV !== "test")
    app.use(logger('dev'));

// frontend route
app.use('/', frontendRoutes);

// backend route
app.use('/', backendRoutes);

// api endpoint route
const corsOptions = { // allow the server to accept GET & POST requests from external clients
    methods: "GET, POST"
};
app.use('/api', cors(corsOptions), apiRoutes);

// error route
app.use(defaultController.view404);

// start app server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

module.exports = app;