function updateWeather(response) {
    let temperatureElement = document.querySelector("#temperature");
    let temperature = response.data.temperature.current;
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windSpeedElement = document.querySelector("#windSpeed");
    let timeElement = document.querySelector("#time");
    let date = new Date(response.data.time * 1000);
    let weatherIconElement = document.querySelector("#weatherIcon");
  
    cityElement.innerHTML = response.data.city;
    timeElement.innerHTML = formatDate(date);
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
    windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
    temperatureElement.innerHTML = Math.round(temperature);
    weatherIconElement.innerHTML = `<img src = "${response.data.condition.icon_url}" class="weatherAppIcon" />`;
  
    getForecast(response.data.city);
  }
  
  function formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[date.getDay()];
  
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
  
    return `${day} ${hours} ${minutes}`;
  }
  
  function searchCity(city) {
    let apiKey = "e8400d96ae4c408oeba366efc6133t5f";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(updateWeather);
  }
  
  function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#searchFormInput");
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = searchInput.value;
  
    searchCity(searchInput.value);
  }
  
  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    return days[date.getDay()];
  }
  
  function getForecast(city) {
    let apiKey = "e30to1ab37b3986111e09fa174072f0d";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
    axios(apiUrl).then(displayForecast);
  }
  
  function displayForecast(response) {
    console.log(response.data);
  
    let days = ["Tue", "Wed", "Thu", "Fri", "Sat"];
    let forecastHtml = "";
  
    response.data.daily.forEach(function (day, index) {
      if (index < 5)
        forecastHtml =
          forecastHtml +
          `
        <div class="weatherForecastDay">
          <div class="weatherForecastDate">${formatDay(day.time)}</div>
          <div>  
            <img src="${day.condition.icon_url}" class="weatherForecastIcon" />
          </div>
          <div class="weatherForecastTemperatures">
            <div class="weatherForecastTemperature">
              <strong>${Math.round(day.temperature.maximum)}°</strong>
            </div>
            <div class="weatherForecastTemperature">${Math.round(
              day.temperature.minimum
            )}°</div>
          </div>
        </div>
      `;
    });
  
    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = forecastHtml;
  }
  
  let searchFormElement = document.querySelector("#searchForm");
  searchFormElement.addEventListener("submit", handleSearchSubmit);
  
  searchCity("Chemnitz");
  