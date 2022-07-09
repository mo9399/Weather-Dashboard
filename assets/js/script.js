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

