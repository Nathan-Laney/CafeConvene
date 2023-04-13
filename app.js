// Require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventRoutes = require('./routes/eventRoutes');
const baseRoutes = require('./routes/baseRoutes');
const {fileUpload} = require('./middleware/fileUpload');
const mongoose = require('mongoose');
const multer = require('multer');
var imgModel = require('./models/image');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://nlaney1:L1uNcry9UynUC4DJ@cluster0.cxivrvg.mongodb.net/?retryWrites=true&w=majority';
app.set('view engine', 'ejs');

// connect to mongoDB
mongoose.connect(url)
.then(()=>{
    console.log("Made it this far (connected to mongodb)");
    app.listen(port, host, ()=>{
        console.log("Server is running on port ", port);
    });
})
.catch(err=>console.log(err.message));

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
