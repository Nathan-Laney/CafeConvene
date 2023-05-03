const {body} = require('express-validator');
const model = require('../models/user');
const {validationResult} = require('express-validator');


exports.validateID = (req, res, next) => {
    const id = req.params.id;
    let regex = /image-[0-9]+-[0-9]+\.[A-Za-z]+/i;
    if (!id.match(/^[0-9a-fA-F]{24}$/) && !id.match(regex) ) {
        let err = new Error('Invalid story id ' + id);
        err.status = 400;
        next(err);
    }
    next();
}

// exports.validateResult = (req, res, next)=>{
//     let user = new model(req.body);
//     if (!errors.isEmpty()) {
//         errors.array().forEach(error => {
//             req.flash("error", error.msg);
//         })
//         return res.redirect("back");
//     } else {
//         return next();
//     }
// }

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})]

exports.validateSignIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})]

exports.validateStory = [body('title', 'Title cannot be empty').notEmpty().trim().escape(), body('content', 'Content must be longer that 10 characters').isLength({min: 10}).trim().escape()]

allowedCategories = ['Coffee Tasting', 'Latte Art Masterclass', 'New Roast Launch', 'New Cafe Opening', 'Sale','Other']
exports.validateCategory = [body('category', 'Category cannot be empty').isIn(allowedCategories)]

exports.validateStartDate = [body('startDate', 'Start date cannot be empty').notEmpty().isISO8601().isAfter(Date.now())]

exports.validateDateAfter = [body('end', 'End time must be after start time').notEmpty().isISO8601().custom((value, { req }) => new Date(value) > new Date(req.body.start)).trim().escape()]
