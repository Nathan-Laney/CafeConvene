const eventModel = require('../models/event');
const {FileUpload} = require('../middlewares/fileUpload')
const { DateTime } = require('luxon');


// GET /events: send all events
exports.index = (req, res, next)=>{
    // res.send('send all events');
    // let events = eventModel.find();
    // let categories = eventModel.findAllCategories();
    // console.log(categories);
    // res.render('./event/', {events, categories});
    //---------- proj3
    const query = eventModel.distinct('category');
    const categoriesPromise = query.exec();
    categoriesPromise.then((categories)=>{
        console.log("a + ", categories);
        eventModel.find()
        .then(events => res.render('./event/index', { events, categories }))
        .catch(err => next(err));
    });

};

// GET /events/new: send html form to create a sto
exports.new = (req, res, next)=>{
    res.render('./event/new');
};

// POST /events: create a new event
exports.create = (req, res, next)=>{
    // let event = req.body;
    
    console.log('define event model');

    let event = new eventModel(req.body);
    event.host_name = req.session.user;
    event.image = "/upload/" + req.file.filename;
    console.log(event);
    
    event.save()
        .then((event) => {
            // console.log(event);
            res.redirect('/event');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

// GET /events:id: send details of event identified by 
exports.show = (req, res, next)=>{
    // res.send('send event with id ' + req.params.id);
    
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id ' + id);
        err.status = 404;
        next(err);
    }

    eventModel.findById(id)
        .then(event => {
            if (event) {
                console.log(event);
                return res.render('./event/event', { event });
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// GET /events:id/edit: send form to edit existing event
exports.edit = (req, res, next)=>{
    // res.send('send the edit form');
    
    let id = req.params.id;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id ' + id);
        err.status = 404;
        next(err);
    }

    eventModel.findById(id)
        .then(event => {
            if (event) {
                console.log(event.start_datetime);
                const startDate = new Date(event.start_datetime);
                const endDate = new Date(event.end_datetime);
                const startISO = startDate.toISOString().slice(0, 16);
                const endISO = endDate.toISOString().slice(0, 16);
                return res.render('./event/edit', { event, startISO, endISO });
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// PUT /events:id: update the sto
exports.update = (req, res, next)=>{
    // res.send('update event with id ' + req.params.id);

    let event = req.body;
    let id = req.params.id;
    console.log(req);

    event.image = "/upload/" + req.file.filename;
    

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id ' + id);
        err.status = 404;
        next(err);
    }
    // console.log(req);
    

    eventModel.findByIdAndUpdate(id,event, {useFindAndModify:false, runValidators:true})
    .then(event=>{
        if(event) {
            return res.redirect('/event/' + id)
        }
        else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

// delete /events:id: delete the event

exports.delete = (req, res, next)=>{
    // res.send('delete event with id ' + req.params.id);
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id ' + id);
        err.status = 404;
        next(err);
    }

    eventModel.findByIdAndDelete(id, {useFindAndModify:false, runValidators:true})
    .then(event=>{
        if(event) {
            return res.redirect('/event')
        }
        else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        next(err);
    });
    
};
