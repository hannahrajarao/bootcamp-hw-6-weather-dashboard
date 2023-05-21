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

function showWeather() {
    // call api to get coordinates from city
    const cityUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=5&appid=${API_key}`;
    await fetch(cityUrl).then(response => response.json()).then(data => getLatAndLon(data));

    // call api to get weather from coordinates
    const locUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    await fetch(locUrl).then(response => response.json()).then(data => displayWeatherData(data));
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