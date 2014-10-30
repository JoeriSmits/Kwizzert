/**
 * Created by Israpil on 30-10-14.
 */

var mongoose = require('mongoose'),
    Ronde = mongoose.model('Ronde');

exports.createOne = function (req, res) {
    var ronde = new Ronde(req.body);

    ronde.save(function () {
        //FIXME Voorbeeld ronde voor testen
        var ronde1 = new Ronde({
            categorie: 'Dieren',
            vraagTekst: 'Wat voor hond is Rex in de tv-serie commissaris Rex?',
            antwoord: "Een herdershond",
            status: true
        });

        ronde1.save(function () {
            ronde.vragen.push(ronde1);
            ronde.save(function (err) {

                return res.send({
                    doc: {
                        Ronde: ronde,
                        vragen: ronde1
                    },
                    err: err
                });
            });
        });
    });
};

exports.retrieveOne = function (req, res) {
    ronde.findOne({ _id: req.params.id }, function (err, person) {
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
    ronde.find(function (err, doc) {
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
