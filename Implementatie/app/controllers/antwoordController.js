/**
 * Created by Joeri55 on 31-10-2014.
 */
var mongoose = require('mongoose'),
    Ronde = mongoose.model('Ronde'),
    Antwoord = mongoose.model('Antwoord');


exports.createOne = function (req, res) {
// Find the document ronde with the right linkHash

    Ronde.findOne({_id: req.params.rondeId}, function (err, doc) {
        var antwoord1 = new Antwoord(req.body);

        antwoord1.save(function (err) {
            if (err) {
                return err;
            }
            // Now we gonna update the ronde with the antwoord id
            doc.ingezonden.push(antwoord1._id);
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
                        ronde: doc,
                        ingezonden: antwoord1
                    },
                    err: err
                });
            });
        });
    });
};

exports.retrieve = function (req, res) {
    Ronde
        .findOne({linkHash: req.params.rondeId})
        .populate('ingezonden')
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

exports.retrieveOne = function (req, res) {
    // Find the answer of a team within the round
    Antwoord.findOne({ _id: req.params.id }, function (err, doc) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            });
        }
        res.json({
            doc: doc,
            err: err
        });
    });
};

exports.retrieveAll = function (req, res) {
    Antwoord.find(function (err, doc) {
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
