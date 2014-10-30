/**
 * Created by Joeri55 on 28-10-2014.
 */

var mongoose = require('mongoose'),
    kwizzUitvoering = mongoose.model('KwizzUitvoering'),
    Team = mongoose.model('Team')
    ;


exports.createOne = function (req, res) {
    // Find the document kwizzUitvoering with the right password
    kwizzUitvoering.findOne({password: req.params.uitvoeringCode}, function (err, doc) {
        var team1 = new Team(req.body);
        team1.save(function (err) {
            if (err) {
                return err;
            }

            // Now we gonna update the kwizzUitvoering with the team id
            doc.teams.push(team1._id);
            doc.save(function (err) {
                if (err) {
                    return res.send({
                        doc: null,
                        err: err
                    });
                }

                // Finally, we return
                return res.send({
                    doc: {
                        kwizzUitvoering: doc,
                        team: team1
                    },
                    err: err
                });
            });
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