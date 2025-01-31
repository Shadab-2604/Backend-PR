

# Weather App

A simple weather app built with **Node.js**, **Express**, and the **OpenWeather API**. This app allows users to search for weather information by entering a city. It provides real-time weather data, such as temperature, weather condition, and wind speed.

## Technologies Used
- **Node.js**: JavaScript runtime used for the backend.
- **Express.js**: Web framework for Node.js that simplifies routing and handling HTTP requests.
- **Axios**: Promise-based HTTP client for making requests to the OpenWeather API to fetch weather data.
- **OpenWeather API**: Third-party API used to get real-time weather data based on city names.
- **MongoDB (optional)**: You can use MongoDB for caching weather data or storing user data (if required).
- **dotenv**: Used to manage environment variables securely (e.g., API keys and database URIs).
- **HTML/CSS/JavaScript**: Frontend technologies used to create and style the weather app.

## Features
- **Weather Search**: Users can enter a city name and get the current weather data (temperature, condition, wind speed).
- **Responsive Design**: Simple, clean, and user-friendly interface.
- **Error Handling**: Displays proper error messages for invalid cities or API issues.

## Installation

### Prerequisites
- **Node.js**: Ensure that [Node.js](https://nodejs.org/) is installed on your machine.
- **MongoDB** (optional): If you want to use MongoDB for caching or user data, sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to set up a cluster.

### Steps to Run the Project

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Shadab-2604/Backend-PR.git
   ```

2. Navigate to the project folder:
   ```bash
   cd Backend-PR/Beginner/Weather\ API
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:
   ```bash
   WEATHER_API_KEY=your_openweather_api_key
   MONGO_URI=your_mongodb_connection_string (optional)
   PORT=3000
   ```

5. Start the server:
   ```bash
   node server.js
   ```

6. Open your browser and go to `http://localhost:3000`.

## How It Works:
1. The user enters a city name in the frontend input field.
2. The frontend sends a request to the backend via the `/weather/:city` route.
3. The backend fetches weather data from the OpenWeather API using **Axios**.
4. The weather data (temperature, weather condition, wind speed) is sent back to the frontend and displayed.

## Environment Variables
Create a `.env` file in the root directory to store the following variables:

```
WEATHER_API_KEY=your_openweather_api_key
MONGO_URI=your_mongodb_connection_string (optional)
PORT=3000
```

### Example `.env` file:
```
WEATHER_API_KEY=1a06c9256e68f304fc82e099b54dc2b0
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/weatherapp
PORT=3000
```

## API Endpoint
- **GET** `/weather/:city`: Fetches weather data for the specified city. 

### Example:
Request:
```
GET http://localhost:3000/weather/London
```

Response:
```json
{
  "city": "London",
  "temperature": 15.2,
  "condition": "clear sky",
  "windSpeed": 3.5
}
```

## Error Handling
If the city name is invalid or there’s an issue fetching data from the API, the backend will return an error message:

Example error response:
```json
{
  "message": "city not found"
}
```

## Contribution
Feel free to fork this repository and submit pull requests to contribute to the project.

## License
This project is licensed under the MIT License.
