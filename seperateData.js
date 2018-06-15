var speratedArray = [];
var message = "ttkId10, India, Bangalore, ttk_magadi, line1, d316, shankar, I0019, temperature, 23.04" + "##";
var message2 = "ttkId10, India, Chennai, ttk_hosur, line1, d316, shankar, I0019, temperature, 23.04" + "##";
var message3 = "ttkId10, India, Pune, ttk_shaniwarWada, line1, d316, shankar, I0019, temperature, 23.04" + "##";
speratedArray = message.split(',');
// // console.log(speratedArray[9]);
// // console.log(parseFloat(speratedArray[9]));
// speratedArray[9] = parseFloat(speratedArray[9]);
// console.log(speratedArray);
// console.log(speratedArray.length);
// // console.log(speratedArray);

// var persons = new Map();
// var persons = {};
// var name1 = "niketan";
// var name2 = "sandesh";
// persons.set(name1,{"nickname": "nicky","age" : 35});
// persons.set(name2, {"nickname": "sandy", "age": 30});
// persons[name1] = {"nickname": "nicky","age" : 35};
// persons[name2] = {"nickname": "sandy", "age": 30};
// if(persons.delete(name1)){
//     console.log("succeded")
// }else{
//     console.log("failed")    
// }
// console.log(typeof(persons));
// console.log(persons.has('niketan'));
// console.log(persons.remove(name1));
var spliMsg = [];
var finalMsg = [];
finalmsg = message + message2 + message3; 
spliMsg = finalmsg.split('##');
// console.log(finalmsg);
console.log(" length: " + spliMsg.length );
for( var i = 0; i < (spliMsg.length - 1); i++){    
        // console.log(spliMsg[i] +" length: " + spliMsg.length + " " + i);        
        // console.log(spliMsg[i]);                
        finalMsg.push(spliMsg[i])
}
console.log("Final message: \n");
console.log(finalMsg + "LEngth is: " + finalMsg.length);