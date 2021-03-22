// import libraries
// path is a built-in node library to handle file system paths
const path = require('path');
// express is a popular Model-View-Controller framework for Node
const express = require('express');
// compression library to gzip responses for smaller/faster transfer
const compression = require('compression');
// favicon library to handle favicon requests
const favicon = require('serve-favicon');
 // Library to parse cookies from the requests
const cookieParser = require('cookie-parser');
// library to handle POST requests any information sent in an HTTP body
const bodyParser = require('body-parser');
// Mongoose is one of the most popular MongoDB libraries for node
const mongoose = require('mongoose');
// express handlebars is an express plugin for handlebars templating
const expressHandlebars = require('express-handlebars');

// import our router.js file to handle the MVC routes
// In MVC, you have 'routes' that line up URLs to controller methods
const router = require('./router.js');

// MONGODB address to connect to.
// The string after mongodb://localhost is the database name. It can be anything you want.
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/simpleMVCExample';

// A number of options for Mongoose to turn on newer features supported by
// newer version of MongoDB.
const mongooseOptions = {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
}



// call mongoose's connect function and pass in the url and options object.
mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});


// Port set by process.env.PORT environment variable.
// If the process.env.PORT variable or the env.NODE_PORT variables do not exist, use port 3000
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// call express to get an Express MVC server object
const app = express();


// app.use tells express to use different options
// This option tells express to use /assets in a URL path as a static mirror to our client folder
app.use('/assets', express.static(path.resolve(`${__dirname}/../client/`)));


// Call compression and tell the app to use it
app.use(compression());


// parse form POST requests as application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// parse application/json body requests.
app.use(bodyParser.json());


// app.set sets one of the express config options
app.engine('handlebars', expressHandlebars({
  defaultLayout: '',
}));
app.set('view engine', 'handlebars');


// set the views path to the template directory
app.set('views', `${__dirname}/../views`);


// call favicon with the favicon path and tell the app to use it
app.use(favicon(`${__dirname}/../client/img/favicon.png`));


// call the cookie parser library and tell express to use it
app.use(cookieParser());


// pass our app to our router object to map the routes
router(app);


// Tell the app to listen on the specified port
app.listen(port, (err) => {
    // if the app fails, throw the err
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});

