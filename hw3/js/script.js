const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");
const results = document.getElementById("results");

const apiKey = "aa6bafdc341d8c67ab691062e8b938f6";

form.addEventListener("submit", validateForm);

async function validateForm(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    message.textContent = "";
    results.innerHTML = "";

    if (!city) {
        message.textContent = "Please enter a city name.";
        message.style.color = "red";
        return;
    }

    await fetchWeatherData(city);
}

async function fetchWeatherData(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    try {
        message.textContent = "Loading weather data...";
        message.style.color = "black";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found.");
        }

        const data = await response.json();

        message.textContent = "";
        displayWeatherData(data);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        message.textContent = "Could not find weather for that city. Please try again.";
        message.style.color = "red";
    }
}

function displayWeatherData(data) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const windSpeed = Math.round(data.wind.speed);

    results.innerHTML = `
        <article class="weather-card">
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <p><strong>Temperature:</strong> ${temperature}°F</p>
            <p><strong>Feels Like:</strong> ${feelsLike}°F</p>
            <p><strong>Condition:</strong> ${data.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${windSpeed} mph</p>
        </article>
    `;
}