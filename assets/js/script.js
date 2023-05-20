const API_key = "";
var currentCity = '';
var lat;
var lon;

function callAPI(url, functionToCall) {
    fetch(url)
    .then(response => response.json())
    .then(data => window[functionToCall](data));
}

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

function showWeather() {
    // call api to get coordinates from city
    const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=5&appid=${API_key}`;
    callAPI(cityUrl, "getLatAndLon");
    console.log('34 lat lon', lat, lon);
    // call api to get weather from coordinates
    const locUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    callAPI(locUrl, "getWeatherData");
}

function getLatAndLon(data) {
    if(data.length === 0) {
        $('#weather').text("no city or location found");
        return;
    }
    cityData = data[0];
    //update city
    $('#weather').text(cityData.name);
    console.log(cityData.name, cityData.lat, cityData.lon);
    lat = cityData.lat;
    lon = cityData.lon;
}

function getWeatherData(data) {
    console.log(data);
}

$(function () {
    if(location.search !== '') {
        currentCity = location.search.substring("?city=".length);
        showWeather();
    }
})