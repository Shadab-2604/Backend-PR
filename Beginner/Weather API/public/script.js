// public/script.js
async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const weatherResultDiv = document.getElementById("weatherResult");

    if (!city) {
        weatherResultDiv.innerHTML = "Please enter a city name.";
        return;
    }

    try {
        const response = await fetch(`/weather/${city}`);
        const data = await response.json();

        if (data.error) {
            weatherResultDiv.innerHTML = `Error: ${data.error}`;
        } else {
            weatherResultDiv.innerHTML = `
                <h3>Weather in ${city}</h3>
                <p>Temperature: ${data.current.temp}°C</p>
                <p>Condition: ${data.current.condition}</p>
            `;
        }
    } catch (error) {
        weatherResultDiv.innerHTML = `Error: Unable to fetch weather data.`;
    }
}
