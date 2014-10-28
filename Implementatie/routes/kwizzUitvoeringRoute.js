/**
 * Created by Joeri55 on 28-10-2014.
 */

var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/kwizzUitvoeringController');

router.route('/kwizzUitvoering')
 //   .get(controller.retrieveAll)
    .post(controller.createOne);

router.route('/kwizzUitvoering/:id')
//    .get(controller.retrieveOne);

module.exports = router;