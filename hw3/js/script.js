// Weather Event Listeners and DOM Elements
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const message1 = document.getElementById("message1");
const results1 = document.getElementById("results1");

// Earthquake Event Listeners and DOM Elements
const earthquakeForm = document.getElementById("earthquakeForm");
const minMagnitudeInput = document.getElementById("minMagnitude");
const message2 = document.getElementById("message2");
const results2 = document.getElementById("results2");

// Weather API Key and Functions
const apiKeyWeather = "aa6bafdc341d8c67ab691062e8b938f6";

weatherForm.addEventListener("submit", validateFormWeather);

async function validateFormWeather(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    message1.textContent = "";
    results1.innerHTML = "";

    if (!city) {
        message1.textContent = "Please enter a city name.";
        message1.style.color = "red";
        return;
    }

    await fetchWeatherData(city);
}

async function fetchWeatherData(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=imperial`;

    try {
        message1.textContent = "Loading weather data...";
        message1.style.color = "black";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found.");
        }

        const data = await response.json();

        message1.textContent = "";
        displayWeatherData(data);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        message1.textContent = "Could not find weather for that city. Please try again.";
        message1.style.color = "red";
    }
}

function displayWeatherData(data) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const windSpeed = Math.round(data.wind.speed);

    results1.innerHTML = `
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

// Earthquake Functions
earthquakeForm.addEventListener("submit", validateFormEarthquake);

async function validateFormEarthquake(event) {
    event.preventDefault();

    const minMagnitude = minMagnitudeInput.value.trim();

    message2.textContent = "";
    results2.innerHTML = "";

    if (!minMagnitude) {
        message2.textContent = "Please enter a minimum magnitude.";
        message2.style.color = "red";
        return;
    }

    if (isNaN(minMagnitude)) {
        message2.textContent = "Please enter a valid number for magnitude.";
        message2.style.color = "red";
        return;
    }

    if (minMagnitude < 1 || minMagnitude > 10) {
        message2.textContent = "Minimum magnitude must be between 1 and 10.";
        message2.style.color = "red";
        return;
    }

    await fetchEarthquakeData(Number(minMagnitude));
}

async function fetchEarthquakeData(minMagnitude) {
    const endDate = new Date();
    const startDate = new Date();

    startDate.setDate(endDate.getDate() - 10);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const url =
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
        `&starttime=${formatDate(startDate)}` +
        `&endtime=${formatDate(endDate)}` +
        `&minmagnitude=${minMagnitude}`;

    try {
        message2.textContent = "Loading earthquake data...";
        message2.style.color = "black";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error fetching earthquake data.");
        }

        const data = await response.json();

        message2.textContent = "";
        displayEarthquakeData(data.features, minMagnitude, startDate, endDate);

    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        message2.textContent = "Could not fetch earthquake data. Please try again.";
        message2.style.color = "red";
    }
}

function getCleanPlaceName(place) {
    if (place.includes(" of ")) {
        return place.split(" of ")[1].toLowerCase();
    }

    return place.toLowerCase();
}

function displayEarthquakeData(earthquakes, minMagnitude, startDate, endDate) {
    results2.innerHTML = "";

    let filteredEarthquakes = earthquakes.filter(function(quake) {
        const magnitude = quake.properties.mag;
        const quakeDate = new Date(quake.properties.time);

        return magnitude >= minMagnitude &&
               quakeDate >= startDate &&
               quakeDate <= endDate;
    });

    filteredEarthquakes.sort(function(a, b) {
        const placeA = getCleanPlaceName(a.properties.place);
        const placeB = getCleanPlaceName(b.properties.place);

        return placeA.localeCompare(placeB);
    });

    if (filteredEarthquakes.length === 0) {
        results2.innerHTML = `<p>No earthquakes found in the past 10 days with magnitude ${minMagnitude} or higher.</p>`;
        results2.style.color = "red";
        return;
    }
    results2.style.color = "black";

    const limitedEarthquakes = filteredEarthquakes.slice(0, 10);

    results2.innerHTML = `
        <p class="resultsMsg">
            Showing earthquakes from the past 10 days with magnitude ${minMagnitude} or higher,
            ordered by place.
        </p>
    `;

    limitedEarthquakes.forEach((quake) => {
        const { mag, place, time, url } = quake.properties;
        const date = new Date(time).toLocaleString();
        const depth = quake.geometry.coordinates[2];

        const quakeCard = document.createElement("article");
        quakeCard.classList.add("earthquake-card");

        quakeCard.innerHTML = `
            <h3><strong>Place:</strong> ${place}</h3>
            <p><strong>Magnitude:</strong> ${mag}</p>
            <p><strong>Date & Time:</strong> ${date}</p>
            <p><strong>Depth:</strong> ${depth} km</p>
            <a href="${url}" target="_blank">View USGS Details</a>
        `;

        results2.appendChild(quakeCard);
    });
}