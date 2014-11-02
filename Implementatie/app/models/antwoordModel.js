/**
 * Created by Joeri55 on 16-10-2014.
 */

var mongoose = require('mongoose');

var antwoordSchema = new mongoose.Schema({
    antwoordTekst: String,
    teamNaam: String,
    accepted: Boolean,
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

module.exports = mongoose.model('Antwoord', antwoordSchema, 'antwoorden');