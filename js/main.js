document.addEventListener('DOMContentLoaded', () => {


    const cityCoordinates = {};

    // Constants
    const API_BASE_URL = 'http://www.7timer.info/bin/api.pl';
    const IMAGE_BASE_PATH = 'images/';


    // DOM Elements
    const fetchWeatherButton = document.getElementById('fetchWeather');
    const citySelector = document.getElementById('citySelector');
    const weatherDisplay = document.getElementById('weatherDisplay');

    // Functions
    function fetchCSVData() {
        return fetch('city_coordinates.csv')
            .then(response => response.text());
    }

    function parseCSVData(data) {
        const rows = data.split('\n');
        rows.slice(1).forEach(row => {
            const [latitude, longitude, city, country] = row.split(',');
            const cityName = city.toLowerCase().trim();
            cityCoordinates[cityName] = { lat: parseFloat(latitude), lon: parseFloat(longitude) };

            const option = document.createElement('option');
            option.value = cityName;
            option.textContent = `${city}, ${country}`;
            citySelector.appendChild(option);
        });
    }

    function fetchWeatherData(coordinates) {
        const apiUrl = `${API_BASE_URL}?lon=${coordinates.lon}&lat=${coordinates.lat}&product=civil&output=json`;

        return fetch(apiUrl)
            .then(response => response.json());
    }
    //this is for date and weather
    function displayWeatherData(data) {
        const currentDate = new Date();
        const forecastData = data.dataseries;

        let weatherHTML = `<h2>${citySelector.value.toUpperCase()} Weather Forecast</h2>`;
        weatherHTML += '<ul>';

        for (let index = 0; index < Math.min(7, forecastData.length); index++) {
            const forecastDate = new Date(currentDate);
            forecastDate.setDate(currentDate.getDate() + index);

            const dayData = forecastData[index];
            const formattedDate = forecastDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const weatherImage = getWeatherImage(dayData.weather);

            weatherHTML += `
                <li>
                    <strong>${formattedDate}</strong><br>
                    <img class="weather-icon" src="${weatherImage}" alt="${dayData.weather}">                
                </li>`;
        }

        weatherHTML += '</ul>';
        weatherDisplay.innerHTML = weatherHTML;
    }


    function displayWeatherData1(data) {
        const currentDate = new Date();
        const forecastData = data.dataseries;

        let temperatureHTML = ''; // Initialize the HTML content

        for (let index = 0; index < Math.min(7, forecastData.length); index++) {
            const forecastDate = new Date(currentDate);
            forecastDate.setDate(currentDate.getDate() + index);

            const dayData = forecastData[index];
            const formattedDate1 = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });

            // Add day and temperature information to the HTML content
            temperatureHTML += `
                <div class="temperature-info">
                    <strong>${formattedDate1}</strong><br>
                    <br>
                    <p>Temperature: ${dayData.temp2m}°C</p><br>
                </div>`;
        }

        // Update the content of the temperatureDisplay div
        document.getElementById('temperatureDisplay').innerHTML = temperatureHTML;
    }

    function getWeatherImage(weather) {
        const weatherImages = {
            clearday: 'clear.png',
            clearnight: 'clear.png',
            clearday: 'clear.png',
            pcloudyday: 'pcloudy.png',
            mcloudyday: 'mcloudy.png',
            cloudyday: 'pcloudy.png',
            lightrainday: 'lightrain.png',
            rain: 'rain.png',
            lightsnow: 'lightsnow.png',
            snow: 'snow.png',
            oshowernight: 'ishower.png',
            lightrainnight:'lightrain.png',
            humidday:'humid.png',
            humidnight:'humid.png',
            ishowerday:'ishower.png'
        };

        const lowerCaseWeather = weather.toLowerCase();
        const imagePath = `${IMAGE_BASE_PATH}${weatherImages[lowerCaseWeather] || 'default.png'}`;
        console.log('Weather:', weather);
        console.log('Lowercase Weather:', lowerCaseWeather);
        console.log('Image Path:', imagePath);

        return imagePath;
    }
    citySelector.addEventListener('change', () => {
        const selectedCity = citySelector.value;
        const coordinates = cityCoordinates[selectedCity];
        console.log('Selected City:', selectedCity);
        console.log('Coordinates:', coordinates);

        if (!coordinates) {
            weatherDisplay.innerHTML = 'Coordinates not available.';
            return;
        }

        fetchWeatherData(coordinates)
            .then(data => {
                displayWeatherData(data); // Display weather forecast
                displayWeatherData1(data); // Display daywise temperature
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherDisplay.innerHTML = 'An error occurred while fetching weather data.';
            });
    });
    // Load CSV data and initialize
    fetchCSVData()
        .then(parseCSVData)
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });

        function updateDigitalClock() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
    
            const digitalClockElement = document.getElementById('digitalClock');
            digitalClockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    
        // Update the digital clock every second
        setInterval(updateDigitalClock, 1000);
    
        // Initial call to update the digital clock
        updateDigitalClock();
});



