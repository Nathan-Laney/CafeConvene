const model = require('../models/event');
const { FileUpload } = require('../middlewares/fileUpload')
const { DateTime } = require('luxon');


// GET /events: send all events
exports.index = (req, res, next) => {
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
    const event = req.body;
    event.host_name = req.session.user;

    // Validate image was uploaded
    if (req.file) {
        event.image = req.file.filename;
        // const image = req.files.filename;
        // event.image = {
        //     data: image.data,
        //     filename: image.name,
        //     contentType: image.mimetype
        // }
    }

    console.log('------------------controller-------------------');
    console.log(req.body);
    console.log('-------------------------------------');
    event = new model(event);

    event.save()//insert the document to the database
        .then(event => res.redirect('/event'))
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

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
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

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    console.log('ssssssssssssssssssssssssss')
    // console.log(event + id) Wow first time i've seen a console.log cause errors
    console.log('ssssssssssssssssssssssssss')

    model.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
        .then(event => {
            req.flash('success', 'Event Edited');
            res.redirect(`/event/${id}`);
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
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