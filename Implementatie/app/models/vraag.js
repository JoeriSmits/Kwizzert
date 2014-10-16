/**
 * Created by Joeri55 on 16-10-2014.
 */
var mongoose = require('mongoose');

var vraagSchema = new mongoose.Schema({
    vraagTekst: String,
    antwoord: String,
    categorie: String
});

module.exports = mongoose.model('Vraag', vraagSchema);