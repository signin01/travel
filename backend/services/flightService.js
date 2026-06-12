// Flight Suggestion Service

class FlightService {
    constructor() {
        // Sample flight data
        this.flightDatabase = {
            'paris': { price: 850, airline: 'Air France', duration: '7h 30m', stops: 0 },
            'tokyo': { price: 1200, airline: 'Japan Airlines', duration: '14h', stops: 1 },
            'new york': { price: 650, airline: 'Delta', duration: '8h', stops: 0 },
            'london': { price: 780, airline: 'British Airways', duration: '7h', stops: 0 },
            'dubai': { price: 950, airline: 'Emirates', duration: '13h', stops: 0 },
            'sydney': { price: 1450, airline: 'Qantas', duration: '20h', stops: 1 },
            'bali': { price: 1100, airline: 'Garuda Indonesia', duration: '18h', stops: 1 },
            'rome': { price: 820, airline: 'Alitalia', duration: '8h 30m', stops: 0 },
            'bangkok': { price: 980, airline: 'Thai Airways', duration: '16h', stops: 1 },
            'mumbai': { price: 890, airline: 'Air India', duration: '14h', stops: 0 }
        };
    }

    async getFlights(destination, dates) {
        const cityKey = destination.toLowerCase().split(',')[0].trim();
        let flight = this.flightDatabase[cityKey] || {
            price: Math.floor(Math.random() * 800) + 500,
            airline: ['Emirates', 'Qatar', 'Singapore Air'][Math.floor(Math.random() * 3)],
            duration: `${Math.floor(Math.random() * 12) + 6}h`,
            stops: Math.random() > 0.7 ? 1 : 0
        };

        // Add alternative flight options
        const alternatives = [
            {
                airline: ['Delta', 'United', 'American'][Math.floor(Math.random() * 3)],
                price: flight.price - 50 + Math.floor(Math.random() * 100),
                duration: flight.duration,
                stops: flight.stops + (Math.random() > 0.8 ? 1 : 0),
                departureTime: ['Morning', 'Afternoon', 'Evening', 'Red-eye'][Math.floor(Math.random() * 4)]
            },
            {
                airline: ['Lufthansa', 'Air Canada', 'KLM'][Math.floor(Math.random() * 3)],
                price: flight.price + 80 + Math.floor(Math.random() * 150),
                duration: flight.duration,
                stops: flight.stops,
                departureTime: ['Morning', 'Afternoon', 'Evening', 'Red-eye'][Math.floor(Math.random() * 4)]
            }
        ];

        return {
            best: {
                airline: flight.airline,
                price: flight.price,
                duration: flight.duration,
                stops: flight.stops === 0 ? 'Direct' : `${flight.stops} stop`,
                departureTime: 'Morning',
                returnTime: 'Afternoon'
            },
            alternatives: alternatives,
            tips: [
                '✈️ Book 2-3 months in advance for best prices',
                '📅 Tuesdays and Wednesdays are cheapest to fly',
                '🎒 Consider nearby airports for better deals'
            ]
        };
    }

    async getPriceAlert(destination, budget) {
        const flight = await this.getFlights(destination);
        const isUnderBudget = flight.best.price <= budget;
        
        return {
            destination: destination,
            currentPrice: flight.best.price,
            userBudget: budget,
            isAffordable: isUnderBudget,
            message: isUnderBudget 
                ? `✅ Great news! Flights to ${destination} are within your budget!`
                : `⚠️ Flights to ${destination} are $${flight.best.price - budget} above your budget`,
            suggestion: isUnderBudget 
                ? 'Book soon as prices may increase!'
                : 'Consider flexible dates or nearby airports for better deals'
        };
    }
}

module.exports = new FlightService();