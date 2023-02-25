const model = require('../models/event');


// GET /events: send all events
exports.index = (req, res)=>{
    // res.send('send all events');
    let events = model.find();
    let categories = model.findAllCategories();
    console.log(categories);
    res.render('./event/', {events, categories});
};

// GET /events/new: send html form to create a sto
exports.new = (req, res)=>{
    res.render('./event/new');
};

// POST /events: create a new
exports.create = (req, res)=>{
    let event = req.body;
    model.save(event);
    console.log(event);
    res.redirect('./event')
};

// GET /events:id: send details of event identified by 
exports.show = (req, res, next)=>{
    // res.send('send event with id ' + req.params.id);
    let id = req.params.id;
    let event = model.findById(id);
    if(event) {
        res.render('./event/event', {event});
    } else {let err = new Error('Cannot find event with ID of ' + id);
        err.status = 404;
        next(err);};
};

// GET /events:id/edit: send form to edit existing event
exports.edit = (req, res, next)=>{
    // res.send('send the edit form');
    let id = req.params.id;
    let event = model.findById(id);
    if(event) {
        res.render('./event/edit', {event});
    } else {let err = new Error('Cannot find event with ID of ' + id);
        err.status = 404;
        next(err);};
};

// PUT /events:id: update the sto
exports.update = (req, res, next)=>{
    // res.send('update event with id ' + req.params.id);
    let event = req.body;
    let id = req.params.id;
    if (model.updateById(id, event)) {
        res.redirect('/event/'+id);
    } else {
        let err = new Error('Cannot find event with ID of ' + id);
        err.status = 404;
        next(err);
    }
};

// delete /events:id: update the event

exports.delete = (req, res, next)=>{
    res.send('delete event with id ' + req.params.id);
    // let id = req.params.id;
    // if (model.deleteById(id)) {
    //     res.redirect('/event');
    // } else {
    //     let err = new Error('Cannot find event with ID of ' + id);
    //     err.status = 404;
    //     next(err);
    // }
    
};
