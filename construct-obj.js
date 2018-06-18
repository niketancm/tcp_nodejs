var message = "ttk, devideId, line1, unit-no1, operation1, thickness=0.10, height=10, weight=100";
var othervalue = message.split(',');
// message2 = "thickness=0.10"
// parameter = message2.split('=')
var myObj = {
    device: othervalue[1],
    line: othervalue[2],
    unit: othervalue[3],
    operation: othervalue[4]
};
for(var i = 5; i < othervalue.length; i++){
    para = othervalue[i].split('=');
    myObj[para[0]] = parseFloat(para[1]);
}


console.log(myObj);