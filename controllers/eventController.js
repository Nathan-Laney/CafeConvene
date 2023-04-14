const model = require('../models/event');
const { FileUpload } = require('../middlewares/fileUpload')
const { DateTime } = require('luxon');


// GET /events: send all events
exports.index = (req, res, next) => {
    // res.send('send all events');
    // let events = model.find();
    // let categories = model.findAllCategories();
    // console.log(categories);
    // res.render('./event/', {events, categories});
    //---------- proj3
    const query = model.distinct('category');
    const categoriesPromise = query.exec();
    categoriesPromise.then((categories) => {
        console.log("a + ", categories);
        model.find()
            .then(events => res.render('./event/index', { events, categories }))
            .catch(err => next(err));
    });

};

exports.new = (req, res) => {
    res.render('./event/new');
};

exports.create = (req, res, next) => {
    const eventData = req.body;
    let event = {
        category: eventData.category,
        title: eventData.title,
        details: eventData.details,
        host_name: req.session.user,
        start_datetime: eventData.start,
        end_datetime: eventData.end,
        location: eventData.location,
    };
    // Validate image was uploaded
    if (req.files) {
        event.image = req.files.filename;
        // const image = req.files.filename;
        // event.image = {
        //     data: image.data,
        //     filename: image.name,
        //     contentType: image.mimetype
        // }
    }

    event = new model(event);

    event.save()//insert the document to the database
        .then(event => res.redirect('/events'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    model.findById(id).populate('host_name', 'firstName lastName')
        .then(event => {
            if (event) {
                return res.render('./event/event', { event });
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
        .then(event => {
            return res.render('./event/edit', { event });
        })
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
        .then(event => {
            res.redirect('/events');
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                err.status = 400;
            next(err);
        });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, { useFindAndModify: false })
        .then(event => {
            res.redirect('/events');
        })
        .catch(err => next(err));
};