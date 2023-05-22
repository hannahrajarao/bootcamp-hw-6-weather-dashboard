const API_key = "88752772fb6dbf7dd85257f7a6545dad";
var currentCity = '';
var cities = [];
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
    if(!cities.includes(cityName))
        cities.push(cityName);
    setLocalStorageCities();
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

function makeWeatherCard(wd, category, title) {
    var date = wd.dt_txt.substring(0,'2023-01-01'.length);
    var temp = toFahrenheit(wd.main.temp);
    var wind = wd.wind.speed;
    var humidity = wd.main.humidity;
    var icon = wd.weather[0].icon;
    var iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    console.log(date, temp, wind, humidity);

    if(category === "#current-weather")
        var classes = "d-flex justify-content-center align-items-center flex-wrap-reverse"; //
    else
        var classes = "col-5 col-md-4 col-lg-2 m-1";

    var card = $("<div>").addClass(classes).addClass("card");
    var contentContainer = $("<div>");

    contentContainer.append($("<h5>").text(title));
    contentContainer.append($("<div>").text("Date: "+date));
    contentContainer.append($("<div>").text("Temp: "+temp+"°F"));
    contentContainer.append($("<div>").text("Wind: "+wind+" MPH"));
    contentContainer.append($("<div>").text("Humidity: "+humidity+"%"));
    card.append(contentContainer);

    var imgEl = $("<img>").attr("src", iconURL);
    card.append(imgEl);
    if(category === "#current-weather") {
        card.addClass('row');
        contentContainer.addClass('col-4');
        imgEl.addClass('col-4');
        contentContainer.addClass('d-inline-block card-body');
        imgEl.addClass('d-inline-block card-img-end');
    }
    $(category).append(card);
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