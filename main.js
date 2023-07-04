//#region DEPENDENCIES
//DEPENDENCIES SETUP-----------------------------------------------------------------------------------------------------
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");
const uri = `mongodb+srv://user:${process.env.dbKey}@cluster0.5mznpmw.mongodb.net/?retryWrites=true&w=majority`;
//------------------------------------------------------------------------------------------------------------------------
//#endregion

//Data communication variables--------
var DATA;
var plants;
//------------------------------------

//Other variables---------------------
var countryName = "Greece"
var URL = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.weatherKey}&q=${countryName}&units=metric`;
//------------------------------------

// Selection of local or remote DB usage.--------------------------------------------------
var DBSite = "remote"; //options are REMOTE or LOCAL
DBSite = DBSite.toUpperCase(); //Security to ensure capitalisation
//------------------------------------


//LOCAL PORT SETUP
const localPort = 3000;

//#region DATABASE LOGIC

//#region MongoDB LOCAL CONNECT & SETUP
async function DBconnect() {
    await mongoose.connect('mongodb://127.0.0.1:27017/PlantsDB').then(() => {
    });
}

const plantSchema = new mongoose.Schema({ names: Array, species: String, tempratures: String, humidity: String, climate: String, ground: String, season: String, uses: String, toxicity: String, commercial: String }, { collection: 'Plants' });
const User = mongoose.model("Plant", plantSchema);
//#endregion

//#region REMOTE DATABASE CONNECTION
//----------------------------------------------------------------------------------

function connectToRemoteDB() {
    const client = new MongoClient(uri);
    const db = client.db("PlantsDB");
    plants = db.collection("Plants");
}
//#endregion

//#region ESTABLISHING CONNECTION USING THE PRIOR SELECTION THROUGH DBSite VARIABLE
switch (DBSite) {
    case "LOCAL":
        DBconnect();
        break;
    case "REMOTE":
        connectToRemoteDB();
        break;
    default:
        console.log("No valid option to connect to. Use 'LOCAL' or 'REMOTE'.");
        break;
}
//#endregion


//#endregion


//APPLICATION SETUP
const app = express();
app.use(express.static(__dirname));

app.listen(localPort, () => {
    console.log("Server is running on port: " + localPort);
})

//ROUTING 
app.get("/", (req, res) => {

    //res.send("Index file request received.");
    res.sendFile(__dirname + "/index.html");
})



//weather DATA SENDING
app.get("/data-request/:country", async function (req, res) {
    URL = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.weatherKey}&q=${req.params.country}&units=metric`
    await main();
    setTimeout(() => { res.send(DATA); }, 1000);


})

//plant DATA SENDING
app.get("/plant-request", async function (req, res) {
    await find(req.query);
    setTimeout(() => { res.send(DATA); }, 1000);
})





// #region WEATHER DATA FETCHING 
async function GetWeatherData() {

    https.get(URL,
        res => {

            let responseBody = '';

            res.on('data', chunk => {
                responseBody += chunk;
            });

            res.on("end", () => {
                DATA = JSON.parse(responseBody);


            });
        }
    );

}

async function main() {
    await GetWeatherData();
};

//#endregion


// #region PLANT DATA FETCHING
async function find(params) { // WORKS SO FAR
    if (Object.keys(params).length == 0) {
        if (DBSite == "LOCAL") {
            DATA = await User.find({});
        }
        else if (DBSite == "REMOTE") {
            let response = await plants.find({});
            DATA = await response.toArray();
        }
    }


    else {


        if (params.climate != "Climate" & params.season != "Season") {
            if (DBSite == "LOCAL") {
                DATA = await User.find({ climate: params.climate, season: params.season });
            }
            else if (DBSite == "REMOTE") {
                let response = await plants.find({ climate: params.climate, season: params.season });
                DATA = await response.toArray();
            }

        }



        else if (params.climate == "Climate" & params.season != "Season") {
            if (DBSite == "LOCAL") {
                DATA = await User.find({ season: params.season });
            }
            else if (DBSite == "REMOTE") {
                let response = await plants.find({ season: params.season });
                DATA = await response.toArray();
            }

        }



        else if (params.climate != "Climate" & params.season == "Season") {
            if (DBSite == "LOCAL") {
                DATA = await User.find({ climate: params.climate });
            }
            else if (DBSite == "REMOTE") {
                let response = await plants.find({ climate: params.climate });
                DATA = await response.toArray();
            }

        }



        else if (params.climate == "Climate" & params.season == "Season") {
            if (DBSite == "LOCAL") {
                DATA = await User.find({});
            }
            else if (DBSite == "REMOTE") {
                let response = await plants.find({});
                DATA = await response.toArray();
            }

        }
    }



}
//#endregion












