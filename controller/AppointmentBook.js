var rest = require('../api/Restclient');

//add function
exports.sendAppointment = function postAppointment(session, date, time, type) {
    var url = 'http://bankchat.azurewebsites.net/tables/BankChat';
    rest.postAppointment(url, date, time,type);

};




//display function
exports.displayAppointment = function getAppointment(session) {
    var url = 'http://bankchat.azurewebsites.net/tables/BankChat';
    rest.getAppointment(url, session);
};



//delete 

 exports.checkDeleteAppointment = function checkDeleteAppointment(session, date, time,  type) {
    var url = 'http://bankchat.azurewebsites.net/tables/BankChat';
    //console.log("check check check check");
    rest.checkDeleteAppointment(url, session, date, time,type);
};



