// Require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventRoutes = require('./routes/eventRoutes');
const baseRoutes = require('./routes/baseRoutes');

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use('/', baseRoutes)

app.use('/event', eventRoutes)

app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");

    }
    // console.log("---------------");
    // console.log(err.status);
    res.status(err.status);
    // console.log("---------------");
    // console.log(err);
    // console.log("---------------");
    res.render('error', {err})
})

// start the server
app.listen(port, host, ()=>{
    console.log('Server is running on port ', port);
});