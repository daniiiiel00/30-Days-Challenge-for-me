const apiKey = "YOUR_API_KEY";
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherData = document.getElementById("weather-data");
const errorMessage = document.getElementById("error-message");

const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("weather-icon");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const weatherCondition = weather[0].main.toLowerCase();

  cityNameEl.textContent = name;
  tempEl.textContent = `${Math.round(main.temp)}°C`;
  descEl.textContent = weather[0].description;
  iconEl.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  // Bonus details
  feelsLikeEl.textContent = `${Math.round(main.feels_like)}°C`;
  humidityEl.textContent = `${main.humidity}%`;
  windSpeedEl.textContent = `${wind.speed} m/s`;

  weatherData.style.display = "block";
  errorMessage.style.display = "none";

  // Background image/gradient based on weather
  updateBackground(weatherCondition);
}

function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  weatherData.style.display = "none";
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = "#f4f4f9";
}

function updateBackground(condition) {
  let background = "linear-gradient(135deg, #a8c0ff, #3f2b96)"; // Default

  if (condition.includes("clear")) {
    background = "linear-gradient(135deg, #87ceeb, #00bfff)"; // Sunny
  } else if (condition.includes("cloud")) {
    background = "linear-gradient(135deg, #b0bec5, #607d8b)"; // Clouds
  } else if (condition.includes("rain") || condition.includes("drizzle")) {
    background = "linear-gradient(135deg, #74ebd5, #acb6e5)"; // Rain
  } else if (condition.includes("snow")) {
    background = "linear-gradient(135deg, #e6e9f0, #c3cfd9)"; // Snow
  } else if (condition.includes("thunderstorm")) {
    background = "linear-gradient(135deg, #536976, #292e49)"; // Thunder
  }

  document.body.style.backgroundImage = background;
}

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) {
    displayError("Please enter a city name.");
    return;
  }

  try {
    const data = await getWeatherData(city);
    displayWeather(data);
  } catch (error) {
    displayError("Invalid city name. Please try again.");
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// Initial state cleanup
window.onload = () => {
  weatherData.style.display = "none";
  errorMessage.style.display = "none";
};
