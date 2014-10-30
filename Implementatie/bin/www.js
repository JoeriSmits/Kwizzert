/**
 * Created by Joeri55 on 16-10-2014.
 */

/*jslint node: true, devel:true */
"use strict";

var http = require('../app'); //Require our app

var server = http.listen(process.env.PORT || 3000, function () {
    console.log('Express server listening on port ' + server.address().port);
});