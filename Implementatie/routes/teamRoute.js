/**
 * Created by Joeri55 on 28-10-2014.
 */

var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/teamController');

router.route('/teams/:uitvoeringCode')
    .post(controller.createOne)
    .get(controller.retrieveTeam);

module.exports = router;