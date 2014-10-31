/**
 * Created by Joeri55 on 31-10-2014.
 */

var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/antwoordController');

router.route('/antwoorden/:rondeId')
    .post(controller.createOne);

module.exports = router;