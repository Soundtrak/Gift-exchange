const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const routes = require('./routes.js');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routers
app.use('/', routes);

// http access-control
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

// PORT
const port = 5000;
app.listen(port, () => {
    console.log(`listening on port ${ port }...`);
});