/**
 * Created by Joeri55 on 16-10-2014.
 */
/*jslint node: true*/
/*jslint nomen: true*/
/*jslint unparam:true*/
"use strict";

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var http = require('http').Server(app);
var io = require('socket.io')(http);

// SocketIO 'Real-time'
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('newTeam', function (team) {
        io.emit('newTeamRegistered', team);
    });
    socket.on('startRonde', function (uitvoeringCode) {
        io.emit('startRonde', uitvoeringCode);
    });
    socket.on('nieuweVraag', function (object) {
        io.emit('nieuweVraag', object);
    });
    socket.on('answerSend', function (object) {
        io.emit('answerSend', object);
    });
    socket.on('endRound', function (uitvoeringCode) {
        io.emit('endRound', uitvoeringCode);
    });
    socket.on('choosingCategories', function (uitvoeringCode) {
        io.emit('choosingCategories', uitvoeringCode);
    });
    socket.on('endUitvoering', function (uitvoeringCode) {
        io.emit('endUitvoering', uitvoeringCode);
    });
    socket.on('teamDeleted', function (object) {
        io.emit('teamDeleted', object);
    });
    socket.on('choosingQuestion', function (object) {
        io.emit('choosingQuestion', object);
    });
});

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

// Getting all the routes in the routes directory
var routes_path = __dirname + '/routes',
    route_files = fs.readdirSync(routes_path);
route_files.forEach(function (file) {
    var route;
    route = require(routes_path + '/' + file);
    app.use('/api', route);
});

// Catch all for unmatched routes
app.all('*', function (req, res) {
    res.send({
        result: {
            code: 1,
            message: "Nothing here. Try http://localhost:3000/api/{resource}"
        }
    });
});

module.exports = http;