const model = require('../models/user');
const Event = require('../models/event');
const RSVPModel = require('../models/rsvp');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {

    let user = new model(req.body);
    user.save()
        .then(user => {
            req.flash('success', 'You have successfully created a new user.');
            res.redirect('/users/login')})
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has been used');
                return res.redirect('/users/new');
            }

            next(err);
        });


};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('wrong email address');
                req.flash('error', 'wrong email address');
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.session.firstName = user.firstName;
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/users/profile');
                        } else {
                            req.flash('error', 'wrong password');
                            res.redirect('/users/login');
                        }
                    });
            }
        })
        .catch(err => next(err));


};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Event.find({ host_name: id }), RSVPModel.find({ user: id })])
        .then(results => {
            const [user, events, rsvps] = results;
            let consideringEvents = [];
            for( e in rsvps) {
                console.log(e)
                if(rsvps[e].status === 'YES' || rsvps[e].status === 'MAYBE') {
                    console.log(rsvps[e])
                    consideringEvents.push(rsvps[e].event)
                }
            }
            console.log('consideringEvents: ', consideringEvents)
            Event.find({_id: {$in: consideringEvents}}).then(consideredEvents=> {
                console.log('consideredEvents: ', consideredEvents)
                res.render('./user/profile', { user, events, consideredEvents})
            }).catch(err => next(err));
        })
        .catch(err => next(err));
};


exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            req.flash('error', 'Please try again');
            return next(err);
        } else
            req.flash('success', 'You have successfully logged out');
            res.redirect('/');
    });

};