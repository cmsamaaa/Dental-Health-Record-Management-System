const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');

const errorController = require('./controllers/errorController');

// routers
const frontendRoutes = require('./routes/frontend');

let PORT = 3000;
if (process.env.ENV !== "test")
    PORT = process.env.PORT || 3000;
else
    PORT = process.env.PORT || 3001;

// init app
const app = express();

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serve css & js
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// middleware
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded

// middleware logger
if (process.env.ENV !== "test")
    app.use(logger('dev'));

// frontend route
app.use('/', frontendRoutes);

// error route
app.use(errorController.get404);

// seed database and start app server
if (process.env.ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
}
else
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });

module.exports = app;