var mongoose                = require('mongoose');
var dbURL                   = "mongodb://localhost:27017/twitter";

module.exports = function() {
    var database = {};
    database.connect = function() {
        // start database
        mongoose.connect(dbURL, function(err) {
            if(err) {
                console.log("Error connecting to database " + err);
                throw err;
            } else {
                console.log("Connected to Database");
            }
        });
    };

    return  database;
};