/**
 * Created by Joeri55 on 28-10-2014.
 */

var mongoose = require('mongoose'),
    kwizzUitvoering = mongoose.model('KwizzUitvoering'),
    Team = mongoose.model('Team')
    ;


exports.createOne = function (req, res) {

};

exports.retrieveTeam = function (req, res) {
    kwizzUitvoering
        .findOne({password: req.params.uitvoeringCode})
        .populate('teams')
        .exec(function (err, doc) {
            if (err) {
                return err;
            }

            return res.send({
                doc: doc,
                err: err
            });
        });
};