var mongoose = require('mongoose');
var data = require('./data-schema');

mongoose.connect('mongodb://localhost:27017/myTestDB`');
 
var db = mongoose.connection;

//check the connection to mongodb
db.on('error', function (err) {
console.log('connection error', err);
});

db.once('open', function () {
console.log('connected.');
});

var dataModel = mongoose.model('dataModel', data.dataSchema);
module.exports.dataModel = dataModel;