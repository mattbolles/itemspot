/*****************************
 *  main backend server file *
 *****************************/

/*****************************
 *           redis           *
 *****************************/
const redis = require("redis");
const redisClient = redis.createClient({host: process.env.REDIS_HOST || 'localhost'});

/*****************************
 *          passport         *
 *****************************/
const passport = require("passport");
require("../config/passport")(passport);

/*****************************
 *          mongoDB          *
 *****************************/
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://team3user:Pu5pTgsjoPmOsNLc@cluster0.qwxma.mongodb.net/team3?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/*****************************
 *          express          *
 *****************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const app = express();
const PORT = 4000;
app.listen(PORT, () => console.log(`server started on ${PORT}`));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// let express server static files
app.use(express.static('public'));
app.use(express.json({
  type: ['application/json', 'text/plain']
}));

// Bodyparser
app.use(express.urlencoded({extended: true}));

// express session
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// EXPRESS ROUTES
// requests gets routed to ../routes/ to keep app.js clean
app.use("/", require("../routes/index.js"));
app.use("/users", require("../routes/users"));
app.use('/api/listings', require('../routes/listings'));
app.use('/api/inquiries', require('../routes/inquiry'));


// // TODO
// app.post("/api/deleteListing", (req, res) => {
//   res.send("deleteListing");
// });


//console.log(app._router.stack);