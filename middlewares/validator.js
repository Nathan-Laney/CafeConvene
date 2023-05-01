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

exports.validateResult = (req, res, next)=>{
    let user = new model(req.body);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash("error", error.msg);
        })
        return res.redirect("back");
    } else {
        return next();
    }
}
