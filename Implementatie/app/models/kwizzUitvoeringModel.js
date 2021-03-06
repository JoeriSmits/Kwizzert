/**
 * Created by Joeri55 on 16-10-2014.
 */
/*jslint node:true*/
/*jslint nomen: true*/
var mongoose = require('mongoose');

var kwizzUitvoeringSchema = new mongoose.Schema({
    teams: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
    ],
    rondes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Ronde' }
    ],
    password: String,
    status: Boolean
});

module.exports = mongoose.model('KwizzUitvoering', kwizzUitvoeringSchema, 'kwizzUitvoeringen');