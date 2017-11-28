var builder = require('botbuilder');
var appointment = require("./AppointmentBook");
var currency = require("./CurrencyRate");
var customVision = require("./CustomVision");
var rest = require('../api/Restclient');
var request = require("request");
//this is luispart

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c86641ce-4e55-4ba0-8144-a33479f29ee3?subscription-key=9550517905df40759773057d1ebe1a7a&verbose=true&timezoneOffset=0&q=	');

    bot.recognizer(recognizer);
// menu right 
    bot.dialog('Menu', [
        function (session, args, next) {
            var msg = session.message.text;
            if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
                    //call custom vision
                    customVision.retreiveMessage(session);
                    //session.endDialog("end end end end end");
            }
            else{
        session.send("Hello welcome to Contoso Bank live chat");
        session.send("We can help you manage bank appointment, view currency rate and recognize currency from upload pictures.")
        }
    }]).triggerAction({
            matches: 'Menu'
    }); 



    //this is add function 
    bot.dialog('AddAppointment', [
        function (session, args, next) {
           
            var msg = session.message.text;
            if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
                    //call custom vision
                    customVision.retreiveMessage(session);
                   // session.endDialog("end end end end end");
            }else{


            session.dialogData.args = args || {};
            var appointmentEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'AppointmentType');
            if (appointmentEntity) {
            session.conversationData["type"] = appointmentEntity.entity;
            builder.Prompts.text(session, "Enter the appointment date, for example 01/01/2017.");
            } else {
                session.send("The type of appointment is not identified! We have investment appointment, statement issues appointment and loan appointment."); 
             }
            
        }
    },
    function (session, results,args,next) {
           if (checkdate(results.response)) {
               session.conversationData["date"] = results.response;
               builder.Prompts.text(session, "Enter the appointment time ,for example 14：00 or 09:30.");

           } else {
                session.conversationData["date"] = null;
                session.send("The formart of appointment date is incorrect, please start book an appointment again.");
              
           }
       },

     function (session, results, next) {
         if (checktime(results.response)) {
             session.conversationData["time"] = results.response;
            var url = 'http://bankchat.azurewebsites.net/tables/BankChat';

             //rest.getAddAppointment(url, session, session.conversationData["date"], session.conversationData["time"], session.conversationData["type"]);
  // console.log("222222222222222222222222222222222222");
            //console.log(getData(url, session, session.conversationData["date"], session.conversationData["time"], session.conversationData["type"],callback(check)));
             getData(url, session, session.conversationData["date"], session.conversationData["time"], session.conversationData["type"],function(check,session,date,time,type){
                //console.log("222222222222222222222222222222222222");
                //console.log(check);
                if(check){
                    session.send('Thanks for booking an appointment with us.');
                    appointment.sendAppointment(session, date, time, type);
                    //session.send('Thanks for booking an appointment with us.');
                }else{
                    session.send("You booked %s appointment on %s at %s already",type,date,day);
                }
             });
             
          
            
             
             session.conversationData["date"] = null;
             session.conversationData["time"] = null;
             session.conversationData["type"] = null;
            
         } else {
             session.conversationData["date"] = null;
             session.send("The formart of appointment time is not incorrect, please start book an appointment again.");
         }
     }
 ]).triggerAction({
     matches: 'AddAppointment'
        });



//show appointment
    bot.dialog('ShowAppointment', [
        function (session, args, next) {
            var msg = session.message.text;
            if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
                    //call custom vision
                    customVision.retreiveMessage(session);
                    //session.endDialog("end end end end end");
            }else{
                
            //session.dialogData.args = args || {};
            //if (!session.conversationData["date"] && !session.conversationData["time"] && !session.conversationData["type"]) {
                session.send("Retrieving your booked appointment date and time");
                appointment.displayAppointment(session);
            //}
        }
    }

    ]).triggerAction({
        matches: 'ShowAppointment'
        });


// delete appointment

bot.dialog('CancelAppointment', [
    function (session, args, next) {
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
                //call custom vision
                customVision.retreiveMessage(session);
               // session.endDialog("end end end end end");
        }else{
            
             session.dialogData.args = args || {};
             var appointmentEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'AppointmentType');
             if ( appointmentEntity) {
                 session.conversationData["type"] = appointmentEntity.entity;
                 builder.Prompts.text(session, "Enter the appointment date you want to delete, for example 01/01/2017");
                 } else {
                    session.send("This type of appointment is not identified! We have investment appointment, statement issues appointment and loan appointment"); 
                 }
            }
        },
    
           function (session, results,args,next) {
    
               if (checkdate(results.response)) {
                   session.conversationData["date"] = results.response;
                   builder.Prompts.text(session, "Enter the appointment time you want to delete ,for example 14：00 and 09:30");
    
               } else {
                    
                   session.send("The formart of appointment date is incorrect, please start delete an appointment again");
                  
               }
           },
    
         function (session, results, next) {
             if (checktime(results.response)) {
                 session.conversationData["time"] = results.response;
                 appointment.checkDeleteAppointment(session, session.conversationData["date"], session.conversationData["time"], session.conversationData["type"]);
                 session.conversationData["date"] = null;
                 session.conversationData["time"] = null;
                 session.conversationData["type"] = null;
                 //session.send('Thanks for deleting an appointment with us.');
             } else {
                session.conversationData["date"] = null;
                session.send("The formart of appointment time is not incorrect, please start delete an appointment again");
             }
         }
     ]).triggerAction({
         matches: 'CancelAppointment'
            });
    

bot.dialog('Currency', [
    function (session, args, next) {
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
                //call custom vision
                customVision.retreiveMessage(session);
                //session.endDialog("end end end end end");
        }else{
            
                    session.dialogData.args = args || {};
                    builder.Prompts.text(session, "Enter base currency, eg.USD.");
                    
                }
            },
                function(session, results, args, next) {
                    if (checkcurreny(results.response)){
                        session.conversationData["base"] = results.response;
                        builder.Prompts.text(session,"Enter currency rate based on the currency you entered, eg.AUD.");
                    }else{
                        //if the response is false restart again 
                        session.send("The base currency format is not right");
                    }
                },
                function(session, results, args, next) {
                   // console.log("hhhhhhhhhhhhhhhhhhhhhhhh");
                    if (checkcurreny(results.response)){
                       //console.log("111111111111111111111111111111");
                        session.conversationData["currency"] = results.response;
                        // display the currency using the rich card
                        currency.displayCurrencyCards(session, session.conversationData["base"] ,session.conversationData["currency"])
            
            
                    }else{
                        //if the response is false restart again 
                        session.send("The currency format is not right");
                    }
                }
            
            ]).triggerAction({
                matches: 'Currency'
                });


}





function checkdate(response) {
    if (response.length !==10){
        return false;
        
    } else {
        
        return true;
    }

}

function checktime(response) {
    if (response.length !== 5) {
        return false;

    } else {

        return true;
    }

}


function checkcurreny(response){
    if(response.length!==3){
        return false
    }else{
        return true;
    }
}


 function getData(url, session, date, time, type,callback){
    var check = true;
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        
     
        if(err){
            console.log(err);
        }else {
            var bookedAppointment = JSON.parse(body);
            //console.log("!!!!!!!!!!!!!!!!!!!!!!");
            //console.log(bookedAppointment);
            for (var index in bookedAppointment) {
                var typeReceived = bookedAppointment[index].type;
                var dateReceived = bookedAppointment[index].date;
                var timeReceived = bookedAppointment[index].time;
               // console.log(dateReceived + '===='+ date);
                //console.log(timeReceived + '===='+ time);

                //console.log(dateReceived === date);
                //console.log(timeReceived === time);
                if (dateReceived === date && timeReceived === time) {
                    
                    check = false;// false
                    }
                }
        
        }

        callback(check,session,date,time,type);
    });
};

