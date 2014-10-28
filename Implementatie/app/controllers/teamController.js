/**
 * Created by Joeri55 on 28-10-2014.
 */

var mongoose = require('mongoose'),
    Team = mongoose.model('team')
    ;


exports.createOne = function (req, res) {

};

exports.retrieveTeam = function (req, res) {
    Team
        .findOne({name: req.params.uitvoeringCode})
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