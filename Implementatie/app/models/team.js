/**
 * Created by Joeri55 on 16-10-2014.
 */
var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
    name: String,
    score: Number
});

module.exports = mongoose.model('Team', teamSchema);