// var message = "22/05/16, India, Bangalore, ttk_magadi, line1, d316, shankar, I0019, temperature, 23.04";
// var speratedArray = message.split(',');
// // console.log(speratedArray[9]);
// // console.log(parseFloat(speratedArray[9]));
// speratedArray[9] = parseFloat(speratedArray[9]);
// console.log(speratedArray);
// console.log(speratedArray.length);
// // console.log(speratedArray);

var newMap = new Map();

name1 = "niketan";
name2 = "sandesh";

soc1 = {"nickname": "nikey", "age": 35};
soc2 = {"nickname": "sandy", "age": 32};

// newMap[name1] = soc1;
// newMap[name2] = soc2;
newMap.set(name1, soc1);
newMap.set(name2, soc2);
newMap.forEach((object, name, newMap) => {
    console.log(name);
    console.log(object);
})
// newM console.log(newMap.has(name1));
// console.log(newMap.delete(name2));
// console.log(newMap.has(name2));


