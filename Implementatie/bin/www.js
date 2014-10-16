/**
 * Created by Joeri55 on 16-10-2014.
 */

/*jslint node: true, devel:true */
"use strict";

var app = require('../app'); //Require our app

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});