// var message = "22/05/16, India, Bangalore, ttk_magadi, line1, d316, shankar, I0019, temperature, 23.04";
// var speratedArray = message.split(',');
// // console.log(speratedArray[9]);
// // console.log(parseFloat(speratedArray[9]));
// speratedArray[9] = parseFloat(speratedArray[9]);
// console.log(speratedArray);
// console.log(speratedArray.length);
// // console.log(speratedArray);

// var persons = new Map();
var persons = {};
var name1 = "niketan";
var name2 = "sandesh";
// persons.set(name1,{"nickname": "nicky","age" : 35});
// persons.set(name2, {"nickname": "sandy", "age": 30});
persons[name1] = {"nickname": "nicky","age" : 35};
persons[name2] = {"nickname": "sandy", "age": 30};
// if(persons.delete(name1)){
//     console.log("succeded")
// }else{
//     console.log("failed")    
// }
// console.log(typeof(persons));
// console.log(persons.has('niketan'));
// console.log(persons.remove(name1));
