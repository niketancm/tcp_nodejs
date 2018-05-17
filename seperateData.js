var message = "22/05/16, India, Bangalore, ttk_magadi, line1, d316, shankar, I0019, temperature, 23.04";
var speratedArray = message.split(',');
// console.log(speratedArray[9]);
// console.log(parseFloat(speratedArray[9]));
speratedArray[9] = parseFloat(speratedArray[9]);
console.log(speratedArray);
console.log(speratedArray.length);
// console.log(speratedArray);