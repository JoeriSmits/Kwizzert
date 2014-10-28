/**
 * Created by Joeri55 on 28-10-2014.
 */

var mongoose = require('mongoose'),
    kwizzUitvoering = mongoose.model('kwizzUitvoering')
    ;

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
    // Setting a session with the kwizzUitvoering password as value.
    req.session.isLoggedIn = req.body.password;

    console.log(res.session.isLoggedIn);
};