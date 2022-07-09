var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#weather-container");
var currentWeatherTitle = document.querySelector("#current-weather-title");
var forecastTitle = document.querySelector("#forecast-title");
var search = document.getElementById("search")

search.addEventListener('click', formSubmitHandler)

function getCityWeather(city) {
  console.log(city, 'CITY NAME LINE 29')
  // format OpenWeather api url
  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=882224f2c6a36fd8e4f6c08b7c9f166e";

  // make a request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      console.log(response, "API RESPONSE LINE 35");
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

function formSubmitHandler(event) {
 
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityWeather(cityName);

     // clear the search input
     $("#city").val("");
    } else {
      alert("Please enter a city");
    }
  };

  var displayWeather = function (weatherData) {
    // format and display data
    $("#current-weather").addClass("border border-info border-5");
    $("#current-weather-title").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ")
    .append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
  
    // current temperature, humidity, and wind speed
    $("#current-weather-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#current-weather-humidity").text("Humidity: " + weatherData.main.humidity + "%");
    $("#current-weather-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");
     
    // use lat & lon to make get uvi and 5-day forecast
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&appid=a42b1bffc45c35fcb28a1fcc1fc29685&units=imperial")
   
    .then(function (response) {
      response.json().then(function (data) {
        //  display uvIndex
        $("#current-weather-uvi").text("UV Index: " + data.current.uvi)
  
        // begin conditional for styling uv index section based on value
        var uvIndexValue = data.current.uvi.toFixed(1);
        uvIndexEl.id = "uv-index";
      
        if (uvIndexValue >= 0 && uvIndexValue <= 3) {
          uvIndexEl.className = "uv-index-green"
        }
        else if (uvIndexValue > 3 && uvIndexValue < 8) {
          uvIndexEl.className = "uv-index-yellow"
        }
        else if (uvIndexValue >= 8) {
          uvIndexEl.className = "uv-index-red"
          
        }
        // 5 day forecast call
        displayForecast(data);
      });
  
    });
  
    // save the city
    searchedCity = weatherData.name;
    saveSearchedCities(weatherData.name);
  };

  var displayForecast = function (data) {
    $("#forecast-title").text("5-Day Forecast:");
  
    // clear any previous entries in the five-day forecast
    $("#forecast").empty();
      
    // Get data for 5 days
    for (i = 1; i <= 5; i++) {
      // create elements div elements for daily weather card
      var cardDiv = $("<div>").addClass("col-md-2 m-2 py-3 card text-white bg-success");
      var cardBodyDiv = $("<div>").addClass("card-body p-1");
  
      // apend card body div to parent card div
      cardDiv.append(cardBodyDiv);
  
      // create elements for daily weather card content
      var cardTitle = $("<h5>").addClass("card-title").text(dayjs(data.daily[i].dt * 1000).format("MM/DD/YYYY"));
      let imgSrc ="https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png";
      var cardImg = $("<img>").attr("src", imgSrc).attr("alt", "weather-icon");
  
      var cardTemp = $("<p>")
      .addClass("card-text")
      .text("Temp: " + data.daily[i].temp.day.toFixed(1) + " °F");
  
      var cardWind = $("<p>")
      .addClass("card-text")
      .text("Wind: " + data.daily[i].wind_speed + " MPH");
  
      var cardHumidity = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + data.daily[i].humidity + "%");
  
      // append content elements to parent div
      cardBodyDiv.append(cardTitle, cardImg, cardTemp, cardWind, cardHumidity);
  
      //append cards to parent forecast div on the page
      $("#forecast").append(cardDiv);
  
    }
  
  };

  // save search history to local storage
  var saveSearchedCities = function(city) {
    if (!searchedCities.includes(city)) {
       searchedCities.push(city);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchedCities));
    localStorage.setItem("searchedCity", JSON.stringify(searchedCity));

    // display searched cities
    loadSearchedCities();
  };

  // load searched cities
  var loadSearchedCities = function () {
    searchedCities = JSON.parse(localStorage.getItem("searchHistory"));
    searchedCity = JSON.parse(localStorage.getItem("searchedCity"));

    // create empty array and string if nothing saved in local storage
    if (!searchedCities) {
      searchedCities = [];
    }

    if (!searchedCity) {
      searchedCity = "";
    }

    // clear previous saved cities
    $("#saved-cities").empty();

    // loop through each city in searchedCities array
    for (i = 0; i < searchedCities.length; i++) {

      // create button
      var cityBtn = $("<button>").addClass("btn btn-secondary").attr("type", "submit").attr("id", searchedCities[i]).text(searchedCities[i]);

      // append button to parent div on the page
      $("#saved-cities").append(cityBtn);
  }

};

loadSearchedCities();

// event handlers
$("#search").on("click", formSubmitHandler);

$("#saved-cities").on("click", function (event) {
    // get button id
    let selectedCity = $(event.target).closest("button").attr("id");
    // pass id through getCityWeather
    getCityWeather(selectedCity);
});