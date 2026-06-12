const ollama = require('ollama');

class OllamaService {
    constructor() {
        this.isAvailable = false;
        this.model = 'llama2';
        this.checkAvailability();
    }

    async checkAvailability() {
        try {
            const response = await ollama.list();
            this.isAvailable = true;
            console.log('✅ Ollama is available');
        } catch (error) {
            this.isAvailable = false;
            console.log('⚠️ Ollama not available. Using fallback mode.');
        }
    }

    async generateResponse(prompt, options = {}) {
        if (!this.isAvailable) {
            return this.getFallbackResponse(prompt);
        }

        try {
            const response = await ollama.chat({
                model: options.model || this.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                stream: options.stream || false
            });
            
            return response.message.content;
        } catch (error) {
            console.error('Ollama error:', error);
            return this.getFallbackResponse(prompt);
        }
    }

    async streamResponse(prompt, onToken) {
        if (!this.isAvailable) {
            onToken(this.getFallbackResponse(prompt));
            return;
        }

        try {
            const stream = await ollama.chat({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                stream: true
            });

            for await (const chunk of stream) {
                onToken(chunk.message.content);
            }
        } catch (error) {
            console.error('Stream error:', error);
            onToken(this.getFallbackResponse(prompt));
        }
    }

    getFallbackResponse(prompt) {
        return [Demo Mode] Ollama is not running. Your prompt: "..."

To enable real AI:
1. Download Ollama from https://ollama.ai
2. Run: ollama pull llama2
3. Run: ollama serve

This is a simulated response. The actual AI would generate a detailed itinerary based on your request.;
    }

    async generateItinerary(destination, days, budget, interests) {
        const prompt = Create a -day travel itinerary for  with a budget of utf8{budget}.
                        Interests: .
                        Include daily activities, costs, and local tips.;
        
        return await this.generateResponse(prompt);
    }
}

module.exports = new OllamaService();
