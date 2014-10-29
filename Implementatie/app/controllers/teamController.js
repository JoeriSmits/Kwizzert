/**
 * Created by Joeri55 on 28-10-2014.
 */

var mongoose = require('mongoose'),
    kwizzUitvoering = mongoose.model('KwizzUitvoering'),
    Team = mongoose.model('Team')
    ;


exports.createOne = function (req, res) {
    var team = new Team(req.body);

    team.save(function (err) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            });
        }

        res.send({
            meta: {},
            err: err,
            doc: team
        });
    });
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

exports.deleteOne = function (req, res) {
    Team.remove({
        name: req.params.name
    }, function (err) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            });
        }

        res.json({
            err: err
        });
    });
};