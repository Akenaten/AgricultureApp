

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
//#endregion

var PLANTLIST;


//Results & Filters Section-----------------------------------------------------------------------------------------------
  var plantA = {'name': 'Cherry blossom' , 'color' : 'purple' , 'season' : 'spring' , 'source' : 'images/cherryBlossom.png'};
  var plantB = {'name': 'Oak' , 'color' : 'brown' , 'season' : 'autumn' , 'source' : 'images/Oak.png' };
  var plantC = {'name': 'Olive' , 'color' : 'green' , 'season' : 'summer', 'source' : 'images/Olive.png' };

 
  


  const plantList = [plantA , plantB , plantC];




// #region Building the result list

function buildResultItem(plant , index){

  //Creating the elements
  var division = document.createElement("div");
  var image = document.createElement("img");
  var button = document.createElement("button");

  //Adding classes etc.
  division.className = "col-2";
  button.className = "btn btn-outline-primary";
  image.setAttribute('src' , plantList[index].source);
  image.className = "resformat";


  //ADDING FUNCTIONALITY TO EACH BUTTON
  button.addEventListener('click' , (event)=>{
    showPlant(index);
    event.stopPropagation();
    
  })

  //Establishing the element hierarchy
  resultsSection.appendChild(division);
  division.appendChild(button);
  button.appendChild(image);
  
}

function produceResults(){ // Building the result list loop
  for(var i = 0; i < PLANTLIST.length ; i++){
    buildResultItem(PLANTLIST[i] , i);
  }
}

// Called whenever you click on a button. Should format the data on the overlay window.
function showPlant(id){ 
  
  overlayWindow.style.visibility = "visible";

  const image = document.getElementById("imgSection");
  const nameSection = document.getElementById("nameSection");
  const extraSection = document.getElementById("extraSection");
  const detailSection = document.getElementById("detailSection");
  const dangerSection = document.getElementById("dangerSection");

  image.setAttribute('src' , plantList[id].source);
  image.className = "enlarged";


  nameSection.innerText = "Name:" + PLANTLIST[id].names[0];
  extraSection.innerText = "Species: " + PLANTLIST[id].species;
  detailSection.innerText = "Season: " + PLANTLIST[id].season;
  dangerSection.innerText = "Dangers: " + PLANTLIST[id].toxicity;
  
}

// #endregion





//-----------------------------------------------------------------------------------------------




//Weather Section-----------------------------------------------------------------------------------------------------------
async function updateWEatherPreview() {
  var response = await fetch("/data-request");
  var data = await response.json();


  countryPrompt.innerText = data.name;
  weatherPrompt.innerText = data.weather[0].main;
  tempraturePrompt.innerText = data.main.temp + " Celsius.";
  humPrompt.innerText = data.main.humidity + "%";
  
  
}


//Plant Database Section-----------------------------------------------------------------------------------------
async function updatePlantItems(){
  var response = await fetch("/plant-request");
  PLANTLIST = await response.json();
  produceResults();
  
}





updatePlantItems();
//updateWEatherPreview();
