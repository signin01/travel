// Flight Suggestions Widget

class FlightSuggestions {
    constructor() {
        this.flightData = null;
    }

    async fetchFlights(destination, budget = null) {
        try {
            let url = `http://localhost:5000/api/flights/${encodeURIComponent(destination)}`;
            if (budget) url += `?budget=${budget}`;
            
            const response = await fetch(url);
            const data = await response.json();
            this.flightData = data;
            this.displayFlights(data);
            return data;
        } catch (error) {
            console.error('Flight fetch error:', error);
        }
    }

    displayFlights(data) {
        const flightHtml = `
            <div class="flight-widget" style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-top: 20px;">
                <h4 style="margin-bottom: 15px;">✈️ Best Flight Deals</h4>
                
                <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                        <div>
                            <div style="font-size: 18px; font-weight: bold;">${data.best.airline}</div>
                            <div>⏱️ ${data.best.duration}</div>
                            <div>🔄 ${data.best.stops}</div>
                            <div>🕐 ${data.best.departureTime} departure</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 28px; font-weight: bold; color: #ffd89b;">$${data.best.price}</div>
                            <div>round trip</div>
                        </div>
                    </div>
                </div>
                
                ${data.priceAlert ? `
                    <div style="background: ${data.priceAlert.isAffordable ? 'rgba(0,184,148,0.3)' : 'rgba(255,107,107,0.3)'}; border-radius: 12px; padding: 15px; margin-bottom: 15px;">
                        <div style="font-weight: bold;">${data.priceAlert.message}</div>
                        <div style="font-size: 14px; margin-top: 5px;">💡 ${data.priceAlert.suggestion}</div>
                    </div>
                ` : ''}
                
                <h5>🔄 Alternative Options</h5>
                ${data.alternatives.map(alt => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div>
                            <div>${alt.airline}</div>
                            <div style="font-size: 12px;">${alt.departureTime} • ${alt.duration}</div>
                        </div>
                        <div style="font-weight: bold;">$${alt.price}</div>
                    </div>
                `).join('')}
                
                <div style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                    <strong>💡 Travel Tips:</strong>
                    <ul style="margin-left: 20px; margin-top: 5px;">
                        ${data.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        const searchBox = document.querySelector('.search-box');
        const existingWidget = document.querySelector('.flight-widget');
        if (existingWidget) existingWidget.remove();
        searchBox.insertAdjacentHTML('beforeend', flightHtml);
    }
}

// Initialize flight suggestions
window.flightSuggestions = new FlightSuggestions();

// Fetch flights when destination is entered
document.getElementById('destination')?.addEventListener('change', function() {
    if (this.value.length > 2) {
        const budget = document.getElementById('budget')?.value;
        window.flightSuggestions.fetchFlights(this.value, budget);
    }
});