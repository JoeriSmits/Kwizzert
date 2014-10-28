/**
 * Created by Joeri55 on 16-10-2014.
 */
var mongoose = require('mongoose');

var kwizzUitvoeringSchema = new mongoose.Schema({
    teams: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
    ],
    password: String
});

module.exports = mongoose.model('KwizzUitvoering', kwizzUitvoeringSchema, 'kwizzUitvoeringen');