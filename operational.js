

// #region Weather Preview vars
//---------------------------------------------------
var tempraturePrompt = document.getElementById("currentTemp");
var countryPrompt = document.getElementById("currentCountry");
var humPrompt = document.getElementById("currentHum");
var weatherPrompt = document.getElementById("currentWeather");
// -----------------------------------------------------------------------
// #endregion

//#region Body, Overlay and Results divisions vars
const resultsSection = document.getElementById("resultsView");
const overlayWindow = document.getElementById("overlayWindow");
const body = document.getElementById("mainContainer");
const countryInput = document.getElementById("countryInput");
const weatherButton = document.getElementById("weatherUpdate");
const weatherBox = document.getElementById("weather_preview");
const seasonFilterOption = document.getElementById("seasonFilter");
const climateFilterOption = document.getElementById("climateFilter");
const filterButton = document.getElementById("filterButton");
//#endregion


//#region Click event handlers for Overlay Window and Body -- WORKS FINE
overlayWindow.addEventListener('click' , (event)=>{
  event.stopPropagation();
});


body.addEventListener("click" , ()=>{
  if(overlayWindow.style.visibility == "visible")
  {
    console.log("Event has reached body!");
    overlayWindow.style.visibility = "hidden";
  }
});

weatherButton.addEventListener("click" , ()=>{
  //console.log(countryInput.value);
  updateWEatherPreview(countryInput.value);
})

filterButton.addEventListener("click" , ()=>{updatePlantItems(true);});
//#endregion

// DEBUG FUNCTION 
document.addEventListener('keypress' , (event)=>{
  
  //console.log(event.key);
  if(event.key == "c"){   // C TO CLEAR RESULTS
  //resultsSection.innerText = "";
  //console.log(seasonFilterOption.value , climateFilterOption.value);
  } else if(event.key == "r"){ //R TO REPOPULATE
    //updatePlantItems(true);
  }
  
});


var PLANTLIST;


//Results & Filters Section-----------------------------------------------------------------------------------------------





// #region Building the result list

function buildResultItem(index , targetList){

  //Creating the elements
  var division = document.createElement("div");
  var image = document.createElement("img");
  var button = document.createElement("button");
  var itemName = document.createElement("p");
  itemName.innerText = targetList[index].names[0];

  //Adding classes etc.
  division.className = "col-2";
  button.className = "btn btn-outline-primary";
  button.style.height = "100%";
  image.setAttribute('src' , targetList[index].source);
  image.className = "resformat";


  //ADDING FUNCTIONALITY TO EACH BUTTON
  button.addEventListener('click' , (event)=>{
    showPlant(index , targetList);
    event.stopPropagation();
    
  })

  //Establishing the element hierarchy
  resultsSection.appendChild(division);
  division.appendChild(button);
  button.appendChild(image);
  button.appendChild(itemName);
  
}

function produceResults(targetList) { // Building the result list loop
  if (targetList.length == 0) {
    resultsSection.innerHTML = "<p style='text-align: center'>No results were found matching your criteria.</p>";
  } else {
    for (var i = 0; i < targetList.length; i++) {
      //console.log("Building items...");
      buildResultItem(i, targetList);
    }
  }
}

// Called whenever you click on a button. Should format the data on the overlay window.
function showPlant(id , targetList){ 
  
  overlayWindow.style.visibility = "visible";

  const image = document.getElementById("imgSection");
  const nameSection = document.getElementById("nameSection");
  const extraSection = document.getElementById("extraSection");
  const detailSection = document.getElementById("detailSection");
  const dangerSection = document.getElementById("dangerSection");

  image.setAttribute('src' , targetList[id].source);
  image.className = "enlarged";


  nameSection.innerText = "Name:" + targetList[id].names[0];
  extraSection.innerText = "Species: " + targetList[id].species;
  detailSection.innerText = "Season: " + targetList[id].season;
  dangerSection.innerText = "Dangers: " + targetList[id].toxicity;
  
}

// #endregion





//-----------------------------------------------------------------------------------------------




//Weather Section-----------------------------------------------------------------------------------------------------------
async function updateWEatherPreview(country) {
  if(country == "" || country == undefined) country = "Greece";
  var response = await fetch(`/data-request/${country}`);
  var data = await response.json();


  countryPrompt.innerText = data.name;
  weatherPrompt.innerText = data.weather[0].main;
  tempraturePrompt.innerText = data.main.temp + " Celsius.";
  humPrompt.innerText = data.main.humidity + "%";
  applyWeatherStyling(data.weather[0].main);
  
  
}


//Plant Database Section-----------------------------------------------------------------------------------------
async function updatePlantItems(filter = false){
  resultsSection.innerText = "";
  //console.log("Sending request...");
  if(filter){
    //console.log("Filter set to true.");
    var response = await fetch(`/plant-request?` + new URLSearchParams({season : seasonFilterOption.value , climate: climateFilterOption.value}));
  } else {
    var response = await fetch("/plant-request");
  }
  
  PLANTLIST = await response.json();
  console.log(PLANTLIST);
  //console.log("Calling production function...");
  produceResults(PLANTLIST);
  //console.log("Call completed.");
}


function applyWeatherStyling(weather){
  switch(weather){
    case "Clouds":
      weatherBox.style.background = "linear-gradient(90deg, rgba(189,189,204,1) 0%, rgba(225,225,230,1) 50%, rgba(143,141,140,1) 100%)";
      break;
    case "Clear":
      weatherBox.style.background = "linear-gradient(40deg, rgba(152,234,252,1) 0%, rgba(247,244,201,1) 50%, rgba(124,190,247,1) 100%)";
      break;
    case "Rain":
      weatherBox.style.background = "linear-gradient(90deg, rgba(200,224,244,1) 0%, rgba(121,156,182,1) 50%, rgba(185,191,196,1) 100%)";
      break;
    case "Drizzle":
      weatherBox.style.background = "linear-gradient(90deg, rgba(158,206,246,1) 0%, rgba(121,156,182,1) 50%, rgba(185,191,196,1) 100%)";
      break;
    case "Thunderstorm":
      weatherBox.style.background = "linear-gradient(90deg, rgba(123,126,97,1) 0%, rgba(77,77,77,1) 50%, rgba(141,142,122,1) 100%)";
      break;
      case "Snow":
        weatherBox.style.background = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(188,226,255,1) 50%, rgba(255,255,255,1) 100%)";
        break;
        case "Mist":
      weatherBox.style.background = "linear-gradient(90deg, rgba(233,248,255,1) 0%, rgba(171,198,209,1) 29%, rgba(228,228,228,1) 100%)";
      break;
      case "Smoke":
      weatherBox.style.background = "linear-gradient(90deg, rgba(149,149,149,1) 0%, rgba(85,85,85,1) 44%, rgba(93,93,93,1) 100%)";
      break;
      case "Haze":
      weatherBox.style.background = "linear-gradient(90deg, rgba(189,189,204,1) 0%, rgba(225,225,230,1) 50%, rgba(143,141,140,1) 100%)";
      break;
      case "Dust":
      weatherBox.style.background = "linear-gradient(90deg, rgba(226,217,192,1) 0%, rgba(195,180,166,1) 44%, rgba(156,140,134,1) 100%;";
      break;
      case "Fog":
      weatherBox.style.background = "linear-gradient(90deg, rgba(233,248,255,1) 0%, rgba(171,198,209,1) 29%, rgba(228,228,228,1) 100%)";
      break;
      case "Squall":
      weatherBox.style.background = "linear-gradient(90deg, rgba(189,189,204,1) 0%, rgba(225,225,230,1) 50%, rgba(143,141,140,1) 100%)";
      break;
      case "Tornado":
      weatherBox.style.background = "linear-gradient(90deg, rgba(189,189,204,1) 0%, rgba(225,225,230,1) 50%, rgba(143,141,140,1) 100%)";
      break;
    default:
      weatherBox.style.background = "green";
  }
  

}



function loadPanels(){
  setTimeout(()=>{updateWEatherPreview();} , 1000);
  setTimeout(()=>{updatePlantItems();} , 3000);
}

loadPanels();
