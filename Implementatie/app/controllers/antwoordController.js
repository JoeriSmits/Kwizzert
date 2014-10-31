/**
 * Created by Joeri55 on 31-10-2014.
 */
var mongoose = require('mongoose'),
    Ronde = mongoose.model('Ronde'),
    Antwoord = mongoose.model('antwoord');


exports.createOne = function (req, res) {
// Find the document ronde with the right linkHash
    Ronde.findOne({linkHash: req.params.rondeId}, function (err, doc) {
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