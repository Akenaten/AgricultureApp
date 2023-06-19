

var weatherURL = "https://api.openweathermap.org/data/2.5/weather?appid=8109d761a64f8595e1ff5763f3f86e73&q=Greece";
var tempraturePrompt = document.getElementById("currentTemp");



async function logData() {
    var response = await fetch("/data-request");
    var data = await response.json();
    console.log(data.main.temp);
  }


  logData();









