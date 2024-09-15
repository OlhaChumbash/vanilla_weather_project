const WEATHER_API_KEY = "e8400d96ae4c408oeba366efc6133t5f";
const FORECAST_API_KEY = "e30to1ab37b3986111e09fa174072f0d";

function updateWeather(response) {
    const { data } = response;
    if (!data || data.status === "not_found") {
        alert("City not found. Please try again.");
        return; 
    }

    const { city, condition, temperature, wind, time } = data;
    const date = new Date(time * 1000);
    
    document.querySelector("#city").innerHTML = city;
    document.querySelector("#time").innerHTML = formatDate(date);
    document.querySelector("#description").innerHTML = condition.description;
    document.querySelector("#humidity").innerHTML = `${temperature.humidity}%`;
    document.querySelector("#wind-speed").innerHTML = `${wind.speed}km/h`;
    document.querySelector("#temperature").innerHTML = Math.round(temperature.current);
    document.querySelector("#weather-icon").innerHTML = `<img src="${condition.icon_url}" class="weather-app-icon" />`;
  
    getForecast(city);
}

function formatDate(date) {
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const hours = date.getHours();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = days[date.getDay()];

    return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
    const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${WEATHER_API_KEY}&units=metric`;
    return axios.get(apiUrl);
}

function handleSearchSubmit(event) {
    event.preventDefault();
    const searchInput = document.querySelector("#search-form-input").value.trim();
  
    if (searchInput === "") {
        alert("Please enter a city.");
        return;
    }

    searchCity(searchInput).then(updateWeather).catch(handleError);
}

function formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
}

function getForecast(city) {
    const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${FORECAST_API_KEY}&units=metric`;
    axios.get(apiUrl).then(displayForecast).catch(() => alert("Error retrieving forecast data. Please try again."));
}

function displayForecast(response) {
    if (!response || !response.data || !response.data.daily) {
        alert("Error retrieving forecast data. Please try again.");
        return;
    }

    const forecastHtml = response.data.daily.slice(0, 5).map(day => `
        <div class="weather-forecast-day">
            <div class="weather-forecast-date">${formatDay(day.time)}</div>
            <div>  
                <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
            </div>
            <div class="weather-forecast-box">
                <div class="weather-forecast-temperature">
                    <strong>${Math.round(day.temperature.maximum)}°</strong>
                </div>
                <div class="weather-forecast-temperature">${Math.round(day.temperature.minimum)}°</div>
            </div>
        </div>
    `).join('');

    document.querySelector("#forecast").innerHTML = forecastHtml;
}

function handleError(error) {
    if (error.response && error.response.data.status === "not_found") {
        alert("City not found. Please try again.");
    } else {
        alert("An error occurred. Please try again later.");
    }
}

document.querySelector("#search-form").addEventListener("submit", handleSearchSubmit);


searchCity("Chemnitz").then(updateWeather).catch(handleError);
