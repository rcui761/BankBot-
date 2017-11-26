var builder = require('botbuilder');
var appointment = require("./AppointmentBook")


exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/99c304ea-afdc-4e68-a30f-e81407f35a5e?subscription-key=2707128c13c84e70926996fd888d8d4e&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('Menu', function (session, args) {
       
        session.send("Hello welcome to Contoso Bank live chat");
        session.send("We can help you manage bank appointment, view currency rate and recognize currency from upload pictures.")

        
    }).triggerAction({
            matches: 'Menu'
    }); 

    //this is add function 
    bot.dialog('AddAppointment', [

         function (session, args, next) {
         session.dialogData.args = args || {};
         var appointmentEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'AppointmentType');
         if (!session.conversationData["date"] && appointmentEntity) {
             session.conversationData["type"] = appointmentEntity.entity;
             builder.Prompts.text(session, "Enter the appointment date , for example 01/01/2017");
             } else {
                session.send("This type of appointment is not identified! We have investment appointment, statement issues appointment and loan appointment"); 
             }
        },

       function (session, results,args,next) {

           if (checkdate(results.response)) {
               session.conversationData["date"] = results.response;
               builder.Prompts.text(session, "Enter the appointment time ,for example 14：00 and 09:30");

           } else {
                session.conversationData["date"] = null;
               session.send("The formart of appointment date is incorrect, please start book an appointment again");
              
           }
       },

     function (session, results, next) {
         if (checktime(results.response)) {
             session.conversationData["time"] = results.response;
             appointment.sendAppointment(session, session.conversationData["date"], session.conversationData["time"], session.conversationData["type"]);
             appointment.displayAddAppointment(session, session.conversationData["date"], session.conversationData["time"], session.conversationData["type"]);
             session.conversationData["date"] = null;
             session.conversationData["time"] = null;
             session.conversationData["type"] = null;
             session.send('Thanks for booking an appointment with us.');
         } else {
            session.conversationData["date"] = null;
             session.send("The formart of appointment time is not incorrect, please start book an appointment again");
         }
     }
 ]).triggerAction({
     matches: 'AddAppointment'
        });



//show appointment
    bot.dialog('ShowAppointment', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.debug(session.conversationData["date"]);
            console.debug(session.conversationData["time"]);
            if (!session.conversationData["date"] && !session.conversationData["time"] && !session.conversationData["type"]) {
                session.send("Retrieving your booked appointment date and time");
                appointment.displayAppointment(session);
            }
        }

    ]).triggerAction({
        matches: 'ShowAppointment'
        });


// delete appointment

bot.dialog('CancelAppointment', [
    
             function (session, args, next) {
             session.dialogData.args = args || {};
             var appointmentEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'AppointmentType');
             if (!session.conversationData["date"] && appointmentEntity) {
                 session.conversationData["type"] = appointmentEntity.entity;
                 builder.Prompts.text(session, "Enter the appointment date you want to delete, for example 01/01/2017");
                 } else {
                    session.send("This type of appointment is not identified! We have investment appointment, statement issues appointment and loan appointment"); 
                 }
            },
    
           function (session, results,args,next) {
    
               if (checkdate(results.response)) {
                   session.conversationData["date"] = results.response;
                   builder.Prompts.text(session, "Enter the appointment time you want to delete ,for example 14：00 and 09:30");
    
               } else {
                    session.conversationData["date"] = null;
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
