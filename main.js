//DEPENDENCIES SETUP
const express = require("express");
const https = require("https");
const ejs = require("ejs");
const URL = "https://api.openweathermap.org/data/2.5/weather?appid=8109d761a64f8595e1ff5763f3f86e73&q=Greece&units=metric";
var DATA;

//LOCAL PORT SETUP
const localPort = 3000;

//APPLICATION SETUP
const app = express();
app.use(express.static(__dirname));


app.listen(localPort , ()=>{
    console.log("Server is running on port: " + localPort);
})

//ROUTING 
app.get("/" , (req, res) => {

    //res.send("Index file request received.");
    res.sendFile(__dirname + "/index.html");
})


var basket = {'cake' : 'sweet'};

//DATA SENDING
app.get("/data-request" , async function(req, res){
    await main();
    res.send(DATA);
    
})



async function GetWeatherData(){
    
    await https.get(URL , 
    res =>{
    
        let responseBody = '';

        res.on('data' , chunk =>{
            responseBody += chunk;
        });

        res.on("end" , ()=>{
            DATA = JSON.parse(responseBody);
            
            
        });
   }
   );
 
}

async function main(){
    await GetWeatherData();
    //setTimeout(()=>{console.log(DATA)}, 2000);
    
    };

    main();














