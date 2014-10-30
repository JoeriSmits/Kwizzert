/**
 * Created by Israpil on 30-10-14.
 */

var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/rondeController');

router.route('/ronden')
    .get(controller.retrieveAll)
    .post(controller.createOne);

router.route('/ronden/:id')
    .get(controller.retrieveOne);

module.exports = router;