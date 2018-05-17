var mongoose = require('mongoose');

//create a schema to insert the data into mongodb
var Schema = mongoose.Schema;
var dataSchema = new Schema ({
    DATETIME: Date,
    REGION: String,
    LOCATION: String,
    PLANT: String,
    LINE: String,
    MODEL: String,
    OPERATOR: String,
    DEVICEID: String,
    PARAMATER: String,
    DATA: Number
});

module.exports.dataSchema = dataSchema;

