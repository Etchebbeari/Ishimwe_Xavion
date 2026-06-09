// Calendar Generation
function generateCalendar() {
    const calendarDiv = document.getElementById('calendar');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let calendarHTML = `<h3>${monthNames[month]} ${year}</h3>`;
    calendarHTML += '<table style="width: 100%; border-collapse: collapse;"><tr>';

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        calendarHTML += `<th style="border: 1px solid #ddd; padding: 10px; background-color: #667eea; color: white;">${day}</th>`;
    });
    calendarHTML += '</tr><tr>';

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<td style="border: 1px solid #ddd; padding: 10px;"></td>';
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() ? 'style="background-color: #667eea; color: white; font-weight: bold;"' : 'style="border: 1px solid #ddd; padding: 10px;"';
        calendarHTML += `<td ${isToday}>${day}</td>`;

        if ((firstDay + day) % 7 === 0 && day !== daysInMonth) {
            calendarHTML += '</tr><tr>';
        }
    }

    calendarHTML += '</tr></table>';
    calendarDiv.innerHTML = calendarHTML;
}

// Weather Widget
function getWeather() {
    const weatherInfo = document.getElementById('weather-info');

    // Check if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(lat, lon);
            },
            (error) => {
                // Default location if geolocation fails
                fetchWeatherData(-1.9536, 29.8739); // Rwanda coordinates
            }
        );
    } else {
        fetchWeatherData(-1.9536, 29.8739); // Default to Rwanda
    }
}

function fetchWeatherData(lat, lon) {
    const apiKey = 'open-meteo'; // Using Open-Meteo (free, no key needed)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const current = data.current;
            const temp = current.temperature_2m;
            const windSpeed = current.wind_speed_10m;
            const weatherCode = current.weather_code;

            const weatherDescription = getWeatherDescription(weatherCode);

            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = `
                <div style="font-size: 3rem; margin: 1rem 0;">🌡️</div>
                <p><strong>Temperature:</strong> ${temp}°C</p>
                <p><strong>Condition:</strong> ${weatherDescription}</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">Latitude: ${lat.toFixed(2)}, Longitude: ${lon.toFixed(2)}</p>
            `;
        })
        .catch(error => {
            console.error('Weather fetch error:', error);
            document.getElementById('weather-info').innerHTML = '<p>Unable to load weather data. Please refresh the page.</p>';
        });
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy with rime',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    getWeather();
});