// Require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const eventRoutes = require("./routes/eventRoutes");
const baseRoutes = require("./routes/baseRoutes");
const userRoutes = require("./routes/userRoutes");
const { fileUpload } = require("./middlewares/fileUpload");
const mongoose = require("mongoose");
// const multer = require('multer');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

//create app
const app = express();

//configure app
let port = 3000;
let host = "127.0.0.1";
let url =
	"mongodb+srv://nlaney1:L1uNcry9UynUC4DJ@cluster0.cxivrvg.mongodb.net/test"; // TODO: Place cluster URL
app.set("view engine", "ejs");

// connect to mongoDB
mongoose
	.connect(url)
	.then(() => {
		console.log("Made it this far (connected to mongodb)");
		app.listen(port, host, () => {
			console.log("Server is running on port ", port);
		});
	})
	.catch((err) => console.log(err.message));

// mount middleware

app.use(
	session({
		secret: "lkasjdlkajslkjdlskajldkjals",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongoUrl: url }),
		cookie: { maxAge: 60 * 60 * 1000 },
	})
);
app.use(flash());

app.use((req, res, next) => {
	res.locals.errorMessages = req.flash("error") || null;
	res.locals.successMessages = req.flash("success") || null;
	// console.log(req.session);
	res.locals.userFirstName = req.session.firstName || null;
	// console.log(req.session);
	// if (typeof req.session.user != "undefined") {
	res.locals.user = req.session.user || null;
	// res.locals.user.firstName = req.session.user.firstName || null;
	// }
	next();
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

app.use("/", baseRoutes);

app.use("/event", eventRoutes);

app.use("/users", userRoutes);

app.use((req, res, next) => {
	let err = new Error("The server cannot locate " + req.url);
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	console.log(err.stack);
	if (!err.status) {
		err.status = 500;
		err.message = "Internal Server Error";
	}
	// console.log("---------------");
	// console.log(err.status);
	res.status(err.status);
	// console.log("---------------");
	// console.log(err);
	// console.log("---------------");
	res.render("error", { err });
});
