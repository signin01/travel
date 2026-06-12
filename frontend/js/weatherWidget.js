// Weather Widget for AI Travel Planner

class WeatherWidget {
    constructor() {
        this.currentDestination = null;
    }

    async fetchWeather(destination) {
        try {
            const response = await fetch(`http://localhost:5000/api/weather/${encodeURIComponent(destination)}`);
            const data = await response.json();
            this.displayWeather(data);
            return data;
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError();
        }
    }

    displayWeather(data) {
        const weatherHtml = `
            <div class="weather-widget" style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-top: 20px;">
                <h4 style="margin-bottom: 15px;">🌤️ Current Weather</h4>
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <div style="text-align: center;">
                        <div style="font-size: 48px;">${data.current.icon}</div>
                        <div style="font-size: 32px; font-weight: bold;">${data.current.temp}°C</div>
                        <div>${data.current.condition}</div>
                    </div>
                    <div>
                        <div>💧 Humidity: ${data.current.humidity}%</div>
                        <div>💨 Wind: ${data.current.wind} km/h</div>
                        <div>🌡️ Feels like: ${data.current.feelsLike}°C</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <h5>📅 5-Day Forecast</h5>
                    <div style="display: flex; gap: 10px; overflow-x: auto; padding: 10px 0;">
                        ${data.forecast.map(day => `
                            <div style="text-align: center; min-width: 80px; background: rgba(255,255,255,0.1); border-radius: 10px; padding: 10px;">
                                <div>${day.date}</div>
                                <div style="font-size: 24px;">${day.icon}</div>
                                <div>${day.temp}°C</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <h5>🎒 Packing Tips</h5>
                    <ul style="margin-left: 20px;">
                        ${data.packingTips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                    <strong>⭐ Best time to visit:</strong> ${data.bestTimeToVisit}
                </div>
            </div>
        `;
        
        // Insert after search box
        const searchBox = document.querySelector('.search-box');
        const existingWidget = document.querySelector('.weather-widget');
        if (existingWidget) existingWidget.remove();
        searchBox.insertAdjacentHTML('beforeend', weatherHtml);
    }

    showError() {
        const searchBox = document.querySelector('.search-box');
        const existingWidget = document.querySelector('.weather-widget');
        if (existingWidget) existingWidget.remove();
        searchBox.insertAdjacentHTML('beforeend', `
            <div class="weather-widget" style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-top: 20px;">
                <p>⚠️ Weather data temporarily unavailable</p>
            </div>
        `);
    }
}

// Initialize weather widget
window.weatherWidget = new WeatherWidget();

// Auto-fetch weather when destination is entered
document.getElementById('destination')?.addEventListener('blur', function() {
    if (this.value.length > 2) {
        window.weatherWidget.fetchWeather(this.value);
    }
});