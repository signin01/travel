// Weather Service - Free API (No API key needed for demo)
// For production, replace with OpenWeatherMap API

class WeatherService {
    constructor() {
        // Sample weather data for popular cities
        this.weatherDatabase = {
            'paris': { temp: 18, condition: '☁️ Cloudy', humidity: 65, wind: 12, icon: '☁️' },
            'tokyo': { temp: 22, condition: '☀️ Sunny', humidity: 55, wind: 8, icon: '☀️' },
            'new york': { temp: 20, condition: '🌧️ Rainy', humidity: 70, wind: 15, icon: '🌧️' },
            'london': { temp: 15, condition: '🌧️ Light Rain', humidity: 75, wind: 10, icon: '🌧️' },
            'dubai': { temp: 35, condition: '☀️ Very Hot', humidity: 40, wind: 5, icon: '☀️' },
            'sydney': { temp: 24, condition: '☀️ Sunny', humidity: 50, wind: 14, icon: '☀️' },
            'bali': { temp: 28, condition: '☀️ Sunny', humidity: 70, wind: 10, icon: '☀️' },
            'rome': { temp: 25, condition: '☀️ Clear Sky', humidity: 60, wind: 8, icon: '☀️' },
            'bangkok': { temp: 32, condition: '🌧️ Thunderstorm', humidity: 80, wind: 6, icon: '🌧️' },
            'mumbai': { temp: 30, condition: '🌧️ Monsoon', humidity: 85, wind: 12, icon: '🌧️' }
        };
    }

    // Get weather for a destination
    async getWeather(destination) {
        const cityKey = destination.toLowerCase().split(',')[0].trim();
        
        // Return real-time like data based on time of day
        const hour = new Date().getHours();
        const isDay = hour > 6 && hour < 18;
        
        let weather = this.weatherDatabase[cityKey] || {
            temp: Math.floor(Math.random() * 20) + 15,
            condition: isDay ? '☀️ Partly Cloudy' : '🌙 Clear Night',
            humidity: Math.floor(Math.random() * 40) + 40,
            wind: Math.floor(Math.random() * 15) + 5,
            icon: isDay ? '⛅' : '🌙'
        };
        
        // Add forecast for next 5 days
        const forecast = [];
        for (let i = 1; i <= 5; i++) {
            forecast.push({
                day: i,
                date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
                temp: weather.temp + Math.floor(Math.random() * 6) - 2,
                condition: weather.condition,
                icon: weather.icon
            });
        }
        
        return {
            current: {
                temp: weather.temp,
                condition: weather.condition,
                humidity: weather.humidity,
                wind: weather.wind,
                icon: weather.icon,
                feelsLike: weather.temp - 2 + Math.floor(Math.random() * 5)
            },
            forecast: forecast,
            bestTimeToVisit: this.getBestTimeToVisit(cityKey),
            packingTips: this.getPackingTips(weather.temp, weather.condition)
        };
    }

    getBestTimeToVisit(city) {
        const recommendations = {
            'paris': 'April-June or September-October for mild weather and fewer crowds',
            'tokyo': 'March-May for cherry blossoms or October-November for autumn colors',
            'new york': 'April-June or September-November for pleasant weather',
            'london': 'May-September for warmest temperatures',
            'dubai': 'November-March for outdoor activities',
            'bali': 'April-October for dry season',
            'default': 'Spring or Fall for the best balance of weather and prices'
        };
        return recommendations[city] || recommendations.default;
    }

    getPackingTips(temp, condition) {
        const tips = [];
        if (temp > 25) tips.push('🧴 Sunscreen and hat');
        if (temp < 15) tips.push('🧥 Warm jacket');
        if (condition.includes('Rain')) tips.push('☂️ Umbrella');
        tips.push('📱 Power bank for photos');
        tips.push('👟 Comfortable walking shoes');
        return tips;
    }
}

module.exports = new WeatherService();