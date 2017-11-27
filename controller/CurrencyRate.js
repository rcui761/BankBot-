 var rest = require('../API/Restclient');
var builder = require('botbuilder');


//Calls 'getNutritionData' in RestClient.js with 'getFoodNutrition' as callback to get ndbno of food
exports.displayCurrencyCards = function getCurrencyData(session,base, currency){
    var url = "https://api.fixer.io/latest?base="+base.toUpperCase();//change the api key 

    rest.getCurrencyData(url, session,base,currency,displayCards);
}
 
 function displayCards(message, session, base, currency ){

        var allcurrency = JSON.parse(message);
        var allrate = allcurrency.rates;
        var date = allcurrency.date;
        var rate = [];
        for (var index in allrate){
            console.log(index);
            if (index.toUpperCase() === currency.toUpperCase()){
                console.log("!!!!!!!!!!!!!!!!!!!!!");
                console.log(allrate[index]);
                rate.push(allrate[index]);
                }      
            }
        session.send(new builder.Message(session).addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "0.5",
                "body": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": base.toUpperCase(),
                                "size": "medium"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Currency Information:"
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "spacing": "none",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "date:" + date,
                                                "size": "small",
                                                "weight": "bolder",
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "spacing": "none",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": currency.toUpperCase() +':'+rate[0],
                                                "size": "small",
                                                "weight": "bolder",
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

        }));
    

}  