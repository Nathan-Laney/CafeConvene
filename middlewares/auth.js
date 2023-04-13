const Event = require('../models/event');

exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        res.redirect('/users/profile');
    }
}

exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are not logged in');
        res.redirect('/users/login');
    }
}

exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    Event.findById(id)
    .then(event=>{
        if(event){
            if(event.author == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    }).catch(err=>next(err));
};