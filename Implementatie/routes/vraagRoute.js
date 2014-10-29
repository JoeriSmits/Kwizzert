/**
 * Created by Joeri55 on 29-10-2014.
 */

var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/vraagController');

router.route('/vragen')
    .post(controller.createOne);

module.exports = router;