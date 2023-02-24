// const model = require('../models/');

// GET /events: send all events
exports.index = (req, res)=>{
    res.render('./index');
};

// GET /events/new: send html form to create a sto
exports.about = (req, res)=>{
    res.render('./about');
};


// GET /events/new: send html form to create a sto
exports.contact = (req, res)=>{
    res.render('./contact');
};
