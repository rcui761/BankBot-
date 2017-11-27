var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/b33575f5-293a-4cc4-8e54-29d9632cfbfc/url',//change url
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'f275912b16f142b4962c8d81e5f9bc28'//change key 
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        
        console.log('Oops, please try again!');
    }
}