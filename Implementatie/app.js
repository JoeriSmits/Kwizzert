/**
 * Created by Joeri55 on 16-10-2014.
 */

var express = require('express');
var path = require('path');

var app = express();

// Using directory client-side as client directory.
app.use(express.static(path.join(__dirname, 'client-side')));

// Running the app
app.listen(3000);
console.log("App running on localhost:3000");