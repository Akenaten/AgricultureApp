//DEPENDENCIES SETUP
const express = require("express");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");

var DATA;

//LOCAL PORT SETUP
const localPort = 3000;

// #region MongoDB LOCAL CONNECT & SETUP
async function DBconnect(){
    await mongoose.connect('mongodb://127.0.0.1:27017/PlantsDB').then(() => {
        //console.log('Connected to MongoDB!');
        //console.log('Connection ready state:' , mongoose.connection.readyState);
    });
}

const plantSchema = new mongoose.Schema({names: Array , species: String , tempratures: String , humidity: String , climate: String , ground: String, season: String , uses: String , toxicity: String , commercial: String }, { collection : 'Plants' });
const User = mongoose.model("Plant" , plantSchema);


DBconnect();
// #endregion

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


var countryName = "Greece"
var URL = `https://api.openweathermap.org/data/2.5/weather?appid=8109d761a64f8595e1ff5763f3f86e73&q=${countryName}&units=metric`;

//weather DATA SENDING
app.get("/data-request/:country" , async function(req, res){
    //console.log(req.params.country);
    URL = `https://api.openweathermap.org/data/2.5/weather?appid=8109d761a64f8595e1ff5763f3f86e73&q=${req.params.country}&units=metric`
    //console.log(URL);
    await main();
    setTimeout(()=>{res.send(DATA);} , 1000);
    
    
})

app.get("/plant-request" , async function(req, res){
    //console.log(Object.keys(req.query).length);
    await find(req.query);
    setTimeout(()=>{res.send(DATA);} , 1000);
})





// #region WEATHER DATA FETCHING 
async function GetWeatherData(){
    
     https.get(URL , 
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
    };

//#endregion

async function find(params){ // WORKS SO FAR
  if(Object.keys(params).length == 0){
    DATA = await User.find({}); //FETCHES ALL THE DATA FROM THE DB
  } else {
    if(params.climate != "Climate" & params.season != "Season"){
        //console.log("Season and Climate specified.");
        DATA = await User.find({climate: params.climate , season: params.season});
    }
    else if(params.climate == "Climate" & params.season != "Season"){
        //console.log("Season specified.");
        DATA = await User.find({season: params.season});
    }
    else if(params.climate != "Climate" & params.season == "Season"){
        //console.log("Climate specified.");
        DATA = await User.find({climate: params.climate});
    }
    else if(params.climate == "Climate" & params.season == "Season"){
        DATA = await User.find({});
    }
  }
  
  
 
}













