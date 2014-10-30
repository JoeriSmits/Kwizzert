/**
 * Created by Joeri55 on 28-10-2014.
 */

var mongoose = require('mongoose'),
    kwizzUitvoering = mongoose.model('KwizzUitvoering'),
    Team = mongoose.model('Team');

exports.createOne = function (req, res) {
    var Kwizz = new kwizzUitvoering({
        password: req.body.password
    });

    Kwizz.save(function () {
        //TODO Voorbeeld populatie voor testen, later weghalen
        var team1 = new Team({
            name: 'Madeliefjes',
            teamColor: '#000000'
        });

        team1.save(function () {
            Kwizz.teams.push(team1);
            Kwizz.save(function (err) {

                // Finally, we return
                return res.send({
                    doc: {
                        kwizzUitvoering: Kwizz,
                        teams: team1
                    },
                    err: err
                });
            });
        });
    });
    // Setting a session with the kwizzUitvoering password as value.
    req.session.isLoggedIn = req.body.password;
};

exports.retrieveOne = function (req, res) {
    kwizzUitvoering.findOne({ _id: req.params.id }, function (err, person) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            });
        }
        res.json({
            doc: person,
            err: err
        });
    });
};


exports.retrieveAll = function (req, res) {
    kwizzUitvoering.find(function (err, doc) {
        if (err) {
            return res.send(
                {
                    doc: null,
                    err: err
                }
            );
        }

        res.json({
            doc: doc,
            err: err
        });
    });
};
