
/* 
   This JavaScript file contains all the code for getting the Open Data, 
   build the HTML code, and create the structure of the whole Web document 
*/

//After the browser finishes loading the main html document, run the logic
window.onload = (event) => {
  main();
}

// URLs of the HKO data
const WEATHERFORECASTURL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en";
const WEATHERAPIURL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en";



// A function to get Current Weather report data
async function getObData () {
  return fetch(WEATHERAPIURL)
    .then(response => response.json());
}



// A function to get 9-Day forecast data
async function getWFore () {
  return fetch(WEATHERFORECASTURL)
    .then(response => response.json());
}




// The main function for building the whole application
async function main () {
 //initiate the request to download weather data
  try {
    var Odata = await getObData(); //wait for weather data
  } catch (err) { //do this when encountering error
    console.error(err);
    document.getElementById('header').innerHTML = "Unable to retrieve weather data. Check the internet connection or try again later.";
    return; //finish and stop the program
  }

  // Once we have the weather data, build the header block
  generateHeader(Odata);
  
  // Then build the temperature block
  generateTempBlk(Odata);
  

  // initiate the request to download forecast data
  try {
    var WFore = await getWFore();  //wait for forecast data
    
    // Once have the forecast data, build the forecast block
    generateWForecast(WFore);
  } catch (err) {  //do this when encountering error
    console.error(err);
  }
  

	
	
	
	
}

// Build the header block
function generateHeader(Odata) {
  //Get the HTML header div block for writing the data
  let output = document.getElementById('header');

  //Create a div element to group all weather info
  let winfoContainer = document.createElement('div');
  winfoContainer.id = 'winfobox';
  output.append(winfoContainer);

  //Create a div element to display the title
  let title = document.createElement('div'); //dynamically create a div element
  title.id = 'htitle';  //unique name for identifying this element
  title.innerHTML = 'Hong Kong';  //html content of this element
  output.append(title);  //dynamically add the new div element to the web document

//display the weather icon
  let iconidx = Odata.icon[0];  //get the icon name from Odata
  let icon = document.createElement('img');  //create an image element
  //set the URL of the weather icon as the image source
  icon.src = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${iconidx}.png`;
  icon.id = 'icon';
  icon.setAttribute('class', 'winfo');  //set a class or catagory name for CSS styling
  winfoContainer.append(icon);  //add the image element to the winfoContainer
  
   //display the temperature info
  let tempBlk = document.createElement('span');  //create a span element
  tempBlk.setAttribute('class', 'winfo');  //group it to the winfo class
  let tempData = Odata.temperature.data[1].value;  //retrieve HKO temp
  //output the value
  tempBlk.innerHTML = `<span id='temp'>${tempData}</span><span class="sup">簞C</span>`;
  winfoContainer.append(tempBlk);

  //display the humidity info
  let humBlk = document.createElement('span');
  humBlk.setAttribute('class', 'winfo');
  let humIcon = "<img id='drop' src='images/drop-64.png'>";
  let humData = Odata.humidity.data[0].value; //retrieve the humidity value
  humBlk.innerHTML = humIcon + `<span id='humidity'>${humData}</span>%`;
  winfoContainer.append(humBlk);
  
   //display the rainfall info
  let rainBlk = document.createElement('span');
  rainBlk.setAttribute('class', 'winfo');
  let rainIcon = "<img src='images/rain-48.png'>";
  let vol = Odata.rainfall.data[13].max; //retrieve rainfall data of Yau Tsim Mong
  rainBlk.innerHTML = rainIcon + "<span id='rain'>" + vol + "</span><small>mm</small>";
  winfoContainer.append(rainBlk);

  // Display the last update time
  let lastUpdateTimeBlk = document.createElement('p');
  lastUpdateTimeBlk.id = "lastUpdateTime";
  let st = Odata.updateTime.indexOf("T")+1;
  lastUpdateTimeBlk.innerHTML = `Last Update: ${Odata.updateTime.substring(st,st+5)}`;
  output.append(lastUpdateTimeBlk);

  //get the HTML div element for this block
  let showT = document.getElementById('showT');

  //Create a div element to display the title
  let ttitle = document.createElement('div');
  ttitle.id = 'ttitle';
  ttitle.innerHTML = 'Temperatures';
  showT.append(ttitle);  //add the element to the block
  
   //Read and clone the location temp dataset
  let myTemp = JSON.parse(JSON.stringify(Odata.temperature.data));




	
	
}

//Build the selection block for selecting temp data of different locations
function generateTempBlk(Odata) {
	
   //Read and clone the location temp dataset
  let myTemp = JSON.parse(JSON.stringify(Odata.temperature.data));	
	
  //Sort the location names
  myTemp.sort((a,b) => {
    let p = a.place.toLowerCase();
    let q = b.place.toLowerCase();
    if (p < q) {
      return -1;
    } else if (p > q) {
      return 1;
    } else {
      return 0;
    }
  });
  
   //create a div element for displaying the selection options
  let tempData = document.createElement('div');
  tempData.id = 'sblock';
  //add each location as a selection option
  let toptions = '';
  myTemp.forEach((elm, idx) => {
    toptions += `<option value="${idx}">${elm.place}</option>`
  });
  //create the label and the list of options
  let tselect = '<label>Select the location</label><select name="temp" id="temp-reg">'+toptions+'</select>'
  tempData.innerHTML = tselect;
  showT.append(tempData);  //add to the block

  //create a div element to display the temp value of the selected location
  let tblock = document.createElement('div');
  tblock.id = 'tblock';
  showT.append(tblock);
  
   //add an event handler for showing the temp data of the selected location
  document.getElementById('temp-reg').addEventListener('change', (evt) => {
    //according to current user's selection, retrieve the data
    let value = myTemp[evt.target.value].value;
    //output the temp data to the 'tblock' div element
    document.getElementById('tblock').innerHTML = `<span class='ltemp'>${value}</span><span class="sup2">簞C</span>`
  });


	

}

//Build the 9-Day forecast block
function generateWForecast(WFore) {
	
  //get the HTML div element for this block
  let FCblock = document.getElementById('forecast');

  //create a div element to display the title of this block
  let Ftitle = document.createElement('div');
  Ftitle.id = 'Ftitle';
  Ftitle.innerHTML = '9-Day Forecast';
  FCblock.append(Ftitle);  //add to display	

 //create another div element to hold and display the forecast data
  let FCWrap = document.createElement('div');
  FCWrap.id = 'FCWrap';
  FCblock.append(FCWrap);

  // Show the 9 days weather forecast
  for (let day of WFore.weatherForecast) {  //for each forecast day

    //create a div element to hold and display the data
    let forecast = document.createElement("div");
    forecast.setAttribute("class", "forecast");  //all forecast data block in the same group

    //get the date and month, e.g. 28/6
    let date = parseInt(day.forecastDate.substring(6))+'/'+parseInt(day.forecastDate.substring(4,6));
    //output the day and date, e.g., Mon 28/6
    let fweek = `<span class="fweek">${day.week.slice(0,3)} ${date}</span>`;
    //output the temp range
    let ftemp = `<span class="ftemp">${day.forecastMintemp.value}-${day.forecastMaxtemp.value} 簞C</span>`;
    //output the humidity range
    let fhumid = `<span class="fhumid">${day.forecastMinrh.value}-${day.forecastMaxrh.value} %</span>`;
    //output the forecast weather icon
    let fIcon = `<img class="fIcon" src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic${day.ForecastIcon}.png">`;


	//get and output rainfall prediction
		let PSRimg;
		switch (day.PSR) {
			case 'High':
				PSRimg = 'https://www.hko.gov.hk/common/images/PSRHigh_50_light.png';
				break;
			case 'Medium High':
				PSRimg = 'https://www.hko.gov.hk/common/images/PSRMediumHigh_50_light.png';
				break;
			case 'Medium':
				PSRimg = 'https://www.hko.gov.hk/common/images/PSRMedium_50_light.png';
				break;
			case 'Medium Low':
				PSRimg = 'https://www.hko.gov.hk/common/images/PSRMediumLow_50_light.png';
				break;
			default:
				PSRimg = 'https://www.hko.gov.hk/common/images/PSRLow_50_light.png';
    }
    let PSR = `<img class="fIcon PSR" src="${PSRimg}">`;

    //output all data to the containing div block
    forecast.innerHTML = fweek + fIcon + PSR + ftemp + fhumid;
    FCWrap.append(forecast);	




  }
	
   
	
}

