const express = require('express');
const router = express.Router();

// Advanced AI routes for Ollama integration
router.post('/generate', async (req, res) => {
    try {
        const { prompt, model = 'llama2' } = req.body;
        
        // Check if Ollama is available
        try {
            const ollama = require('ollama');
            const response = await ollama.chat({
                model: model,
                messages: [{ role: 'user', content: prompt }]
            });
            res.json({ success: true, result: response.message.content });
        } catch (ollamaError) {
            // Fallback response
            res.json({ 
                success: true, 
                result: generateFallbackResponse(prompt),
                message: 'Using fallback mode. Start Ollama for real AI responses.'
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate packing list
router.post('/packing-list', async (req, res) => {
    const { destination, days, weather, activities } = req.body;
    
    const packingList = {
        essentials: ['Passport', 'Visa', 'Travel Insurance', 'Flight Tickets', 'Hotel Booking'],
        clothing: ['Weather-appropriate clothes', 'Comfortable shoes', 'Swimwear', 'Jacket'],
        accessories: ['Sunglasses', 'Hat', 'Travel adapter', 'Power bank'],
        toiletries: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Sunscreen'],
        medical: ['First aid kit', 'Medications', 'Hand sanitizer']
    };
    
    res.json(packingList);
});

// Generate budget estimate
router.post('/budget-estimate', async (req, res) => {
    const { destination, days, travelStyle = 'moderate' } = req.body;
    
    const dailyBudget = {
        budget: { food: 30, hotel: 50, transport: 20, activities: 20 },
        moderate: { food: 50, hotel: 100, transport: 30, activities: 40 },
        luxury: { food: 100, hotel: 250, transport: 60, activities: 100 }
    };
    
    const style = dailyBudget[travelStyle] || dailyBudget.moderate;
    const total = (style.food + style.hotel + style.transport + style.activities) * days;
    
    res.json({
        travelStyle,
        daily: style,
        total,
        currency: 'USD',
        tip: 'Add 20% buffer for unexpected expenses'
    });
});

function generateFallbackResponse(prompt) {
    return ✨ AI Response (Demo Mode)\n\nBased on your request: "..."\n\n📝 This is a fallback response. For real AI responses:\n1. Install Ollama from https://ollama.ai\n2. Run: ollama pull llama2\n3. Run: ollama serve\n\nYour request has been received and will be processed when AI is available.;
}

module.exports = router;
