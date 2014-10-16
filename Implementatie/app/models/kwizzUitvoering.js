var mongoose = require('mongoose');

var kwizzUitvoeringSchema = new mongoose.Schema({
    teams: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
    ],
    password: String
});

module.exports = mongoose.model('kwizzUitvoering', kwizzUitvoeringSchema);