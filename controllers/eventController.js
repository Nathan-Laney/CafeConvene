const model = require("../models/event");
const userModel = require("../models/user");
const RSVPmodel = require("../models/rsvp");
const { FileUpload } = require("../middlewares/fileUpload");
const { DateTime } = require("luxon");
const rsvp = require("../models/rsvp");

// GET /events: send all events
exports.index = (req, res, next) => {
	const query = model.distinct("category");
	const categoriesPromise = query.exec();
	categoriesPromise.then((categories) => {
		console.log("Categories found: ", categories);
		model
			.find()
			.then((events) =>
				res.render("./event/index", { events, categories })
			)
			.catch((err) => next(err));
	});
};

exports.new = (req, res) => {
	res.render("./event/new");
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

	console.log("------------------controller-------------------");
	console.log(req.body);
	console.log("-------------------------------------");
	eventModel = new model(event);

	eventModel
		.save() //insert the document to the database
		.then((event) => res.redirect("/event"))
		.catch((err) => {
			if (err.name === "ValidationError") {
				err.status = 400;
			}
			next(err);
		});
};

exports.show = (req, res, next) => {
	let id = req.params.id;
	//an objectId is a 24-bit Hex string
	// id is the id of the current event. we need the whole object
	model
		.findById(id)
		.then((foundEvent) => {
			// console.log("foundEvent: ", foundEvent);
			RSVPmodel.aggregate([
				{ $match: { event: foundEvent._id } },
				{ $group: { _id: "$status", count: { $sum: 1 } } },
			])
				.then((rsvpCounts) => {
					model
						.findById(id)
						.populate("host_name", "firstName lastName")
						.then((event) => {
							if (event) {
								// console.log(event);
                                // console.log('rsvpCounts: ', rsvpCounts)
                                // console.log('rsvpCounts[0]._id: ', rsvpCounts[0]._id)
                                // console.log('rsvpCounts[0].count: ', rsvpCounts[0].count)
                                let RSVPdYes = 0;
                                for (let i = 0; i < rsvpCounts.length; i++) {
                                    // console.log('rsvpCounts[', i,']._id: ', rsvpCounts[i]._id)
                                    // console.log('rsvpCounts[', i,'].count: ', rsvpCounts[i].count)
                                    if (rsvpCounts[i]._id === "YES") {
                                        RSVPdYes = rsvpCounts[i].count;
                                    }
                                }
                                // console.log('RSVPdYes: ', RSVPdYes)
								return res.render("./event/event", { event, RSVPdYes});
							} else {
								let err = new Error(
									"Cannot find a event with id " + id
								);
								err.status = 404;
								next(err);
							}
						})
						.catch((err) => next(err));
				})
				.catch((err) => next(err));
		})
		.catch((err) => next(err));
	// find number of RSVPs for this event

	// then show the event page
};

exports.edit = (req, res, next) => {
	let id = req.params.id;
	model
		.findById(id)
		.then((event) => {
			if (event) {
				console.log(event.start_datetime);
				const startDate = new Date(event.start_datetime);
				const endDate = new Date(event.end_datetime);
				const startISO = startDate.toISOString().slice(0, 16);
				const endISO = endDate.toISOString().slice(0, 16);
				return res.render("./event/edit", { event, startISO, endISO });
			} else {
				let err = new Error("Cannot find a event with id " + id);
				err.status = 404;
				next(err);
			}
		})
		.catch((err) => next(err));
};

exports.update = (req, res, next) => {
	let event = req.body;
	let id = req.params.id;
	console.log("-----------------update-----------------");
	// console.log(event + id) Wow first time i've seen a console.log cause errors
	console.log("----------------------------------------");

	model
		.findByIdAndUpdate(id, event, {
			useFindAndModify: false,
			runValidators: true,
		})
		.then((event) => {
			req.flash("success", "Event Edited");
			res.redirect(`/event/${id}`);
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				err.status = 400;
			}
			next(err);
		});
};

exports.delete = (req, res, next) => {
	let id = req.params.id;
	model
		.findByIdAndDelete(id, { useFindAndModify: false })
		.then((event) => {
			// delete all RSVPs associated with this event
			filter = { event: id };
			RSVPmodel.deleteMany(filter)
				.then(res.redirect("/events"))
				.catch((err) => next(err));
		})
		.catch((err) => next(err));
};

exports.rsvp = (req, res, next) => {
	// let event = req.body;
	let id = req.params.id; // current id of the event
	// console.log("---------RSVP event----------");
	// console.log(req.params.id);
	// console.log("-----------------------------");
	let status = req.body.RSVP;
	// console.log(status);
	// console.log(res.locals.user); // current id of the user
	let filter = { event: req.params.id, user: res.locals.user }; // gets the event ID
	let update = { status: req.body.RSVP }; // gets the rsvp status (yes, no, maybe)

	// find the event hostname for that event, compare to current user, and if they match, error
	model
		.findById(id)
		.then((event) => {
			console.log("event.host_name._id: ", event.host_name._id);
            userModel.findById(res.locals.user).then((currentUser) => {
                // console.log('currentUser: ', currentUser);
                currentUserId = currentUser._id; 
                console.log('currentUserId: ', currentUserId);
                // console.log('res.locals.user: ', res.locals.user);
                if (!event.host_name._id.equals(currentUserId)) {
                    console.log("You can RSVP if you are not the host. ");
                    // then if they dont match, create or update the RSVP status
                    RSVPmodel.findOneAndUpdate(filter, update, {
                        upsert: true,
                        new: true,
                    })
                        .then((event) => {
                            req.flash("success", "RSVP Successful");
                            res.redirect(`/event/${id}`);
                        })
                        .catch((err) => {
                            if (err.name === "ValidationError") {
                                err.status = 400;
                            }
                            next(err);
                        });
                } else {
                    console.log('You cannot RSVP if you are the host. ')
                    req.flash("error", "You cannot RSVP if you are the host. ");
			        res.redirect(`/event/${id}`);
                }
            }).catch((err => {next(err)}));
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				err.status = 400;
			} else {
				let err = new Error("You cannot RSVP if you are the host. ");
				err.status = 401;
				next(err);
			}
			next(err);
		});
};
