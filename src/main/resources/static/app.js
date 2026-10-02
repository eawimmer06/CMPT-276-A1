const cityInput = document.getElementById("city");
const viewCityButton = document.getElementById("viewCity");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const wind = document.getElementById("wind");
const description = document.getElementById("description");


const cityButtons = document.querySelectorAll(".cityButton");

const loading10 = document.getElementById("loading10");
const errorMessage10 = document.getElementById("errorMessage10");

const cityName10 = document.getElementById("cityName10");
const temperature10 = document.getElementById("temperature10");
const wind10 = document.getElementById("wind10");
const description10 = document.getElementById("description10");


viewCityButton.addEventListener("click", function() {

    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city.";
        return;
    }

    getWeather(city, false);

});


cityButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const city = button.dataset.city;

        getWeather(city, true);

    });

});


async function getWeather(city, isTop10) {

    let currentLoading;
    let currentErrorMessage;

    if (isTop10) {
        currentLoading = loading10;
        currentErrorMessage = errorMessage10;
    } else {
        currentLoading = loading;
        currentErrorMessage = errorMessage;
    }

    currentLoading.style.display = "block";
    currentErrorMessage.textContent = "";

    try {

        // Find the city's latitude and longitude
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Could not find city");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found");
        }

        const latitude = locationData.results[0].latitude;
        const longitude = locationData.results[0].longitude;


        // Get the current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`
        );

        if (!weatherResponse.ok) {
            throw new Error("Could not get weather");
        }

        const weatherData = await weatherResponse.json();
        const currentWeather = weatherData.current;


        // Display the weather in the correct table
        if (isTop10) {

            cityName10.textContent = city;
            temperature10.textContent =
                currentWeather.temperature_2m + " °C";
            wind10.textContent =
                currentWeather.wind_speed_10m + " km/h";
            description10.textContent =
                getWeatherDescription(currentWeather.weather_code);

        } else {

            cityName.textContent = city;
            temperature.textContent =
                currentWeather.temperature_2m + " °C";
            wind.textContent =
                currentWeather.wind_speed_10m + " km/h";
            description.textContent =
                getWeatherDescription(currentWeather.weather_code);

        }

    } catch (error) {

        currentErrorMessage.textContent =
            "Could not load weather for " + city + ".";

    } finally {

        currentLoading.style.display = "none";

    }
}


function getWeatherDescription(weatherCode) {

    if (weatherCode === 0) {
        return "Clear sky";
    }

    if (weatherCode === 1 ||
        weatherCode === 2 ||
        weatherCode === 3) {
        return "Cloudy";
    }

    if (weatherCode === 45 ||
        weatherCode === 48) {
        return "Fog";
    }

    if (weatherCode >= 51 &&
        weatherCode <= 57) {
        return "Drizzle";
    }

    if (weatherCode >= 61 &&
        weatherCode <= 67) {
        return "Rain";
    }

    if (weatherCode >= 71 &&
        weatherCode <= 77) {
        return "Snow";
    }

    if (weatherCode >= 80 &&
        weatherCode <= 82) {
        return "Rain showers";
    }

    if (weatherCode >= 85 &&
        weatherCode <= 86) {
        return "Snow showers";
    }

    if (weatherCode >= 95) {
        return "Thunderstorm";
    }

    return "Unknown";
}