const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const bodyParser = require('body-parser');
const cors = require('cors');

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

connectDB().then(() => {
  // Setup Sessions - stored in MongoDB
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cors());

  //Use flash messages for errors, info, etc...
  app.use(flash());

  app.use('/', require('./routes/auth'));
  app.use('/api/post', require('./routes/post'));

  app.get('/', (req, res) => {
    res.render('landingPage/landingPage.ejs');
  });
  
  // Listen after we've connected to the DB and set up sessions/passport
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, console.log(`Server is running on ${PORT}`));
}).catch(err => console.log('Failed to connect to DB', err));
