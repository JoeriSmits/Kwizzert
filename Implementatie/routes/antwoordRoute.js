/**
 * Created by Joeri55 on 31-10-2014.
 */

var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/antwoordController');

router.route('/antwoorden/')
    .get(controller.retrieveAll);

router.route('/antwoorden/:rondeId')
    .post(controller.createOne)
    .get(controller.retrieve);

router.route('/antwoorden/:id')
    .get(controller.retrieveOne);

module.exports = router;