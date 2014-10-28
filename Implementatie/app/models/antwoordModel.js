/**
 * Created by Joeri55 on 16-10-2014.
 */

var mongoose = require('mongoose');

var antwoordSchema = new mongoose.Schema({
    antwoordTekst: String,
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'team' }
});

module.exports = mongoose.model('antwoord', antwoordSchema, 'antwoorden');