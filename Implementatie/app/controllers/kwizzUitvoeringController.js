/**
 * Created by Joeri55 on 28-10-2014.
 */

var mongoose = require('mongoose'),
    kwizzUitvoering = mongoose.model('KwizzUitvoering'),
    Team = mongoose.model('Team')
    ;

exports.createOne = function (req, res) {
    var Kwizz = new kwizzUitvoering({
        password: req.body.password
    });


    Kwizz.save(function () {
        //TODO Voorbeeld populatie voor testen, later weghalen
        var team1 = new Team({
            name: 'Madeliefjes'
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