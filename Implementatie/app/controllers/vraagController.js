/**
 * Created by Joeri55 on 29-10-2014.
 */

var mongoose = require('mongoose'),
    Vraag = mongoose.model('Vraag');

exports.createOne = function (req, res) {
    var doc = new Vraag(req.body);

    doc.save(function (err) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            });
        }

        res.send({
            doc: doc,
            err: err,
            meta: {}
        });
    });
};

exports.retrieveAll = function (req, res) {
    Vraag.find(function (err, doc) {
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

// Retrieve questions filtered on categorie
exports.retrieve = function (req, res) {
    Vraag.find({categorie: req.params.categorie}, function (err, doc) {
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
    })
};