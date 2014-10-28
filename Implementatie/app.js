/**
 * Created by Joeri55 on 16-10-2014.
 */

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// SocketIO connect
io.on('connection', function(socket){
    console.log('a user connected');
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

var Vraag = mongoose.model('vraag');

var vraag1 = new Vraag({
    vraagTekst: "Dit is een test",
    antwoord: "Hallo dit is het antwoord",
    categorie: "test"
});

vraag1.save();

module.exports = app;