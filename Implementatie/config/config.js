/**
 * Created by Joeri55 on 16-10-2014.
 */

/*jslint node:true*/
module.exports = {
    development: {
        debug: true,                                            // set debugging on/off
        db: 'mongodb://localhost/kwizzert',                     // change with your database
        port: 3000                                              // change 3000 with your port number
    },
    test: {
        debug: false,                                           // set debugging on/off
        db: 'mongodb://localhost/kwizzert',                     // change with your database
        port: 1300                                              // change 1300 with your port number
    },
    production: {

    }
};