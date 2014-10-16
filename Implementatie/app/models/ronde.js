/**
 * Created by Joeri55 on 16-10-2014.
 */
var mongoose = require('mongoose');

var rondeSchema = new mongoose.Schema({
    categorieen: [String],
    vraagTekst: [String],
    status: Boolean,
    ingezonden: { type: mongoose.Schema.Types.ObjectId, ref: 'antwoord' }
});

module.exports = mongoose.model('ronde', rondeSchema, 'ronden');