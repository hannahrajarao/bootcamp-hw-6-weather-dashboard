const API_key = "";
const url = `http://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=${API_key}`;

function callAPI(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => getAPIdata(data));
}

function getAPIdata(data) {

}
