const API_key = "";
var currentCity = '';
var lat;
var lon;

function search() {
    getCity();
}

function getCity() {
    const city = $("#city-input").val();
    redirect(city);
}

function redirect(city) {
    location = `?city=${city}`;
}

function addToList(cityName) {
    $('#past-searches').append();
}

function updateCityList() {
    cities.sort();
    $('#past-searches').empty();
    for(var city of cities) {
        var cityButton = $('<a>').attr('href', `?city=${city}`).attr('id',currentCity).attr('role','button');
        cityButton.addClass('btn btn-secondary btn-block');
        cityButton.text(city);
        $('#past-searches').append(cityButton);
    }
}

function setLocalStorageCities() {
    localStorage.setItem('weather_app_cities', cities);
}

function updateLocalStorageCities() {
    var cityStrings =  localStorage.getItem('weather_app_cities');
    if(cityStrings !== null)
        cities = cityStrings.split(',');
}

async function showWeather() {
    // call api to get coordinates from city
    const cityUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=5&appid=${API_key}`;
    await fetch(cityUrl).then(response => response.json()).then(data => getLatAndLon(data));

    // call api to get weather from coordinates
    const locUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    await fetch(locUrl).then(response => response.json()).then(data => displayWeatherData(data));
}

function getLatAndLon(data) {
    if(data.length === 0) {
        $('#city-name').text("no city or location found");
        return;
    }
    var cityData = data[0];
    var cityName = cityData.name;
    $('#city-name').append($("<h4>").text(cityName).addClass("my-3 ml-2"));
    addToList(cityName);
    updateLocalStorageCities();
    updateCityList();
    lat = cityData.lat;
    lon = cityData.lon;
}

function displayWeatherData(data) {
    console.log(data);
    var weatherData = data.list;
    console.log(weatherData);
    makeWeatherCard(weatherData[0], '#current-weather', "Right Now");
    for(var i=4; i<weatherData.length; i+=8) {
        var wd = weatherData[i];
        console.log(wd);
        makeWeatherCard(wd, '#five-days');
    }
}

function toFahrenheit(kelvin) {
    return Math.round(1.8*(kelvin-273)+32);
}

$(function () {
    updateLocalStorageCities();
    updateCityList();
    if(location.search !== '') {
        currentCity = location.search.substring("?city=".length);
        showWeather();
    }
})