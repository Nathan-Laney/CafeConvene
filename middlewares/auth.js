const Event = require('../models/event');

exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        next()
    } else {
        req.flash('error', 'You have already logged in');
        return res.redirect('/users/profile');
    }
}

exports.isLoggedIn = (req, res, next) => {
    console.log('---------auth.js--------');
    console.log(req.body);
    console.log('-----------------');

    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
}

exports.isHost = (req, res, next) => {
    let id = req.params.id;
    Event.findById(id)
        .then(e => {
            if (e) {
                if (e.host_name == req.session.user) {
                    next();
                } else {
                    let err = new Error('Unauthorized Access to resource');
                    err.status = 401;
                    next(err);
                }
            } else {
                let err = new Error(`Cannot find event with id ${id}`);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
}

exports.isNotHost = (req, res, next) => {
    let id = req.params.id;
    Event.findById(id)
        .then(e => {
            if (e) {
                if (e.host_name !== req.session.user) {
                    next();
                } else {
                    let err = new Error('The host cannot access this resource');
                    err.status = 401;
                    next(err);
                }
            } else {
                let err = new Error(`Cannot find event with id ${id}`);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
}