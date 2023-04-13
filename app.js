// Require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventRoutes = require('./routes/eventRoutes');
const baseRoutes = require('./routes/baseRoutes');
const userRoutes = require('./routes/userRoutes')
const {fileUpload} = require('./middlewares/fileUpload');
const mongoose = require('mongoose');
// const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
var imgModel = require('./models/image');

//create app
const app = express();

//configure app
let port = 3000;
let host = '127.0.0.1';
let url = 'mongodb://127.0.0.1:27017/CafeConvene'; // TODO: Place cluster URL
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

app.use(
    session({
        secret: "REMOVED",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://127.0.0.1:27017/demos'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use('/', baseRoutes)

app.use('/event', eventRoutes)

app.use('/users', userRoutes)

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
