var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myTestDB');
 
var db = mongoose.connection;


//check the connection to mongodb
db.on('error', function (err) {
console.log('connection error', err);
});
db.once('open', function () {
console.log('connected.');
});

//create a schema to insert the data into mongodb
var newSchema = mongoose.Schema;
var dbSchema = new newSchema ({
    // DATETIME: Date,
    LOCATION: String,
    // PLANT: String,
    // LINE: String,
    // MODEL: String,
    // OPERATOR: String,
    // DEVICEID: String,
    PARAMATER: String,
    DATA: Number
});
