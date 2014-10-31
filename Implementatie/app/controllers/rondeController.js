/**
 * Created by Israpil on 30-10-14.
 */

var mongoose = require('mongoose'),
    kwizzUitvoering = mongoose.model('KwizzUitvoering');
Ronde = mongoose.model('Ronde');

exports.createOne = function (req, res) {
    // Find the document kwizzUitvoering with the right password
    kwizzUitvoering.findOne({password: req.params.uitvoeringCode}, function (err, doc) {
        var ronde1 = new Ronde(req.body);
        ronde1.save(function (err) {
            if (err) {
                return err;
            }

            // Now we gonna update the kwizzUitvoering with the team id
            doc.rondes.push(ronde1._id);
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
                        team: ronde1
                    },
                    err: err
                });
            });
        });
    });
};

exports.retrieveOne = function (req, res) {
    ronde.findOne({_id: req.params.id}, function (err, person) {
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

exports.updateOne = function (req, res) {
    Ronde.findOne({linkHash: req.params.id}, function (err, doc) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            });
        }
        doc.vraagTekst.push(req.body.vraagTekst);

        // save the doc
        doc.save(function (err) {
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
    })
};
