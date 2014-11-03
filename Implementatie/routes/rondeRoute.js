/**
 * Created by Israpil on 30-10-14.
 */
/*jslint node:true*/
/*jslint nomen: true*/
var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/rondeController');

router.route('/ronden')
    .get(controller.retrieveAll);

router.route('/ronden/:uitvoeringCode')
    .post(controller.createOne);

router.route('/ronden/:id')
    .get(controller.retrieveOne)
    .put(controller.updateOne);

module.exports = router;