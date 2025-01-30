// Function to fetch weather data from the backend
async function getWeather() {
  const city = document.getElementById('city').value;
  const weatherResultDiv = document.getElementById('weatherResult');

  if (!city) {
      alert('Please enter a city!');
      return;
  }

  try {
      // Fetch weather data from the backend
      const response = await fetch(`/weather/${city}`);
      const data = await response.json();

      if (response.ok) {
          // Display weather information
          weatherResultDiv.innerHTML = `
              <p>Weather in ${data.city}:</p>
              <p>Temperature: ${data.temperature}°C</p>
              <p>Condition: ${data.condition}</p>
              <p>Wind Speed: ${data.windSpeed} m/s</p>
          `;
      } else {
          // Display error message
          weatherResultDiv.innerHTML = `<p>${data.message}</p>`;
      }
  } catch (error) {
      weatherResultDiv.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
      console.error('Error fetching weather data:', error);
  }
}
