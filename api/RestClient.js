var request = require("request");
//add function 
exports.postAppointment = function getData(url, date, time,type) {
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "type" : type,
            "date" : date,
            "time" : time
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(body);

        }
        else{
            console.log(error);  
        }
      });
};

exports.getAddAppointment = function getData(url, session, date, time, type){
    
        request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
            if(err){
                console.log(err);
            }else {
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    console.log(body);
                    var bookedAppointment = JSON.parse(body);
                    var allAppointmentdate = [];
                    var allAppointmenttime = [];
                    var allAppointmenttype = [];
                    for (var index in bookedAppointment) {
                        var typeReceived = bookedAppointment[index].type;
                        var dateReceived = bookedAppointment[index].date;
                        var timeReceived = bookedAppointment[index].time;
                        console.log("In in in in in in in ");
                        console.log(dateReceived);
                        console.log(date);
                        console.log(timeReceived);
                        console.log(time);
                        if (dateReceived === date && timeReceived === time) {
                            console.log("44444444444444444444444444444444444444");
                            session.send("You booked %s apointment on %s at %s already, please book another one.", typeReceived, dateReceived, timeReceived);  
                       
                            deleteMoreAppointment(url, session, date, time, type, bookedAppointment[index].id);
                        } 
                
                    }
                  
            }
        });
    };



deleteMoreAppointment= function deleteData(url, session, date, time, type, id) {
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type': 'application/json'
        }
    };

    request(options, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            console.log(body);
        } else {
            console.log(err);
            console.log(res);
            console.log("done done done done");
        }
    })

};




//display function 
exports.getAppointment = function getData(url, session) {
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function (err, res, body) {
        if (err) {
            console.log(err);
        } else {
            //callback(body, session);// what the meaning of callback 
            var bookedAppointment = JSON.parse(body);
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
        }
    });
};


//delete function 

exports.checkDeleteAppointment = function getData(url, session, date, time,type) {
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function (err, res, body) {
        if (err) {
            console.log(err);
        } else {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            var bookedAppointment = JSON.parse(body);
                var check = 0;
                //var row= 0;
                var allAppointmentdate = [];
                var allAppointmenttime = [];
                var allAppointmenttype = [];
                 for (var index in bookedAppointment) {
                    //var row = row + 1;
                    var typeReceived = bookedAppointment[index].type;
                    var dateReceived = bookedAppointment[index].date;
                    var timeReceived = bookedAppointment[index].time;
                    console.log("In in in in in in in ");
                    console.log(dateReceived);
                    console.log(date);
                    console.log(timeReceived);
                    console.log(time);
                /*     if (dateReceived != date && timeReceived != time && typeReceived != type){

                        check = check + 1; 
                    } */
                    if (dateReceived === date && timeReceived === time && typeReceived === type){
                        deleteMoreAppointment(url, session, date, time, type, bookedAppointment[index].id);
                        session.send("Thanks for deleting an appointment with us.");
                        check = check+1;
                    }
                         
                }
                console.log("check check check check ");
                console.log(check);
                console.log("row row row row row ");
                //console.log(row);
                console.log("true or false");
                //console.log(check === row);
                console.log(check != 0);
                console.log(check !== 0);
                if (check === 0){
                    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                    session.send("You did not book %s appointment on %s at %s before.",type,date,time);
                }

           
        }
    });
};




exports.deleteAppointment= function deleteData(url, session, date, time, type, id, callback) {
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type': 'application/json'
        }
    };

    request(options, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            //console.log(body);
            callback(body, session, date,time,type);
        } else {
            console.log(err);
            console.log(res);
        }
    })

};


//currency

exports.getCurrencyData = function getData(url, session,base,currency,callback){
    
        request.get(url, function processGetRequest(err,res,body){
            if(err){
                console.log(err);
            }else {

                callback(body,session,base,currency)
                

                
            }
        });
    };
 





