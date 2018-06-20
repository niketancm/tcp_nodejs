
const mongodb = require('mongodb').MongoClient;

const URL = 'mongodb://localhost:27017/'

// mongodb.connect(URL, function(err, db){
//     if(err) throw err;
//     var dbo = db.db("esya-test");
//     dbo.collection('clientInfo').find().toArray(function(err, res){
//         // console.log(res);
//         console.log(res[0].Location)
//         db.close();
//     });

// });

//usong promises
// mongodb.connect(URL, function(err, db){
//         if(err) throw err;
//         var dbo = db.db("esya-test");
//         var coll = dbo.collection('clientInfo');
//         var prom = new Promise(function (resolve, reject){
//             coll.find({clientId: "ttk"}).toArray(function(err, res){
//                 // console.log(res);
//                 // result = res;
//                 resolve(res);
//                 // return res;
//             });
//         });

//         prom.then(function(res){
//             console.log(res);
//         });
//     });

//using distinct
var result = [];
mongodb.connect(URL, function(err, db){
    if(err) throw err;
    var dbo = db.db("esya-test");
    var coll = dbo.collection('clientInfo');
    var prom = new Promise(function (resolve, reject){
        coll.distinct("deviceId", { "Location": "Coimbatore"}, function(err, res){
        // console.log(res);
        resolve(res);
        });
    });

    prom.then(function(res){
        result = res;
    })    
});

