/**
 * Created by Joeri55 on 28-10-2014.
 */

var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/kwizzUitvoeringController');

router.route('/kwizzUitvoeringen')
 //   .get(controller.retrieveAll)
    .post(controller.createOne);

router.route('/kwizzUitvoeringen/:id')
//    .get(controller.retrieveOne);

module.exports = router;