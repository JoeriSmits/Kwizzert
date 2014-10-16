/**
 * Created by Joeri55 on 16-10-2014.
 */

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');

var app = express();

// Using directory client-side as client directory.
app.use(express.static(path.join(__dirname, 'client-side')));

// Load configuration
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config.js')[env];

// Connect to the mongoDB
mongoose.connect(config.db);

// Getting all the models in the models directory
var models_path = __dirname + '/app/models',
    model_files = fs.readdirSync(models_path);
model_files.forEach(function (file) {
    require(models_path + '/' + file);
});

module.exports = app;