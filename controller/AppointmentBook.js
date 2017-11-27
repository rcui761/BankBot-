var rest = require('../api/Restclient');

//add function
exports.sendAppointment = function postAppointment(session, date, time, type) {
    var url = 'http://bankchat.azurewebsites.net/tables/BankChat';
    rest.postAppointment(url, date, time,type);

};

exports.displayAddAppointment = function getAddAppointment(session, date, time, type) {
    var url = 'http://bankchat.azurewebsites.net/tables/BankChat';
    rest.getAddAppointment(url,session, date, time,type);
   
};



//display function
exports.displayAppointment = function getAppointment(session) {
    var url = 'http://bankchat.azurewebsites.net/tables/BankChat';
    rest.getAppointment(url, session, handleAppointmentResponse);
};


function handleAppointmentResponse(message, session) {//message is the body
    var bookedAppointment = JSON.parse(message);
    var allAppointmentdate = [];
    var allAppointmenttime = [];
    var allAppointmenttype = [];
    session.send("There is your booked appointment(s).")
    for (var index in bookedAppointment) {
        var typeReceived = bookedAppointment[index].type;
        var dateReceived = bookedAppointment[index].date;
        var timeReceived = bookedAppointment[index].time;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        allAppointmenttype.push(typeReceived);
        allAppointmentdate.push(dateReceived);
        allAppointmenttime.push(timeReceived);
        session.send("You have %s apointment which was booked on %s at %s", allAppointmenttype[index], allAppointmentdate[index], allAppointmenttime[index]);
    }

};


//delete 

 exports.checkDeleteAppointment = function checkDeleteAppointment(session, date, time,  type) {
    var url = 'http://bankchat.azurewebsites.net/tables/BankChat';
    console.log("check check check check");
    rest.checkDeleteAppointment(url, session, date, time,type);
};



