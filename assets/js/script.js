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

