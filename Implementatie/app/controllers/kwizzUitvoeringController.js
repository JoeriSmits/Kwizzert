/**
 * Created by Joeri55 on 28-10-2014.
 */

var mongoose = require('mongoose'),
    kwizzUitvoering = mongoose.model('kwizzUitvoering');

exports.createOne = function (req, res) {
    var doc = new kwizzUitvoering(req.body);
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
