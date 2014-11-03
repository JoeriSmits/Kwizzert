/**
 * Created by Joeri55 on 29-10-2014.
 */
/*jslint node:true*/
/*jslint nomen: true*/
var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/vraagController');

router.route('/vragen')
    .post(controller.createOne)
.get(controller.retrieveAll);

router.route('/vragen/:categorie')
    .get(controller.retrieve);


module.exports = router;