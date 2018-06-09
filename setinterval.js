mess = "ttkId10,tn,hosur,p1,l1,m1,op1,d1,temp,23.08";
// m = "101"
var sendData = "";
  function sendEmail(sendData) {
   console.log(sendData);
}
var tempData = [23.147,23.117,23.105,23.096,23.123,23.124,23.118,23.098,23.151,23.116,23.153,23.154,23.096,23.126,23.124,23.122,23.156,23.144,23.115,23.096,23.117,23.106,23.135,23.159,23.106,23.121,23.109,23.100,23.129,23.165];

// for(var i = 0; i < tempData.length; i++){
  sendData = mess + tempData[0];
//   setInterval(sendEmail(sendData), 1000);
// console.log(i);
var i = 0;
setInterval(function () {
    sendData = mess + tempData[i];
   console.log(sendData);
   i++;    
}, 1000);
  // console.log()
// }