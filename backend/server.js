const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const weatherRoutes = require('./routes/weather');
const flightRoutes = require('./routes/flights');

const app = express();

// ========================================
// FIXED HELMET CSP FOR INLINE SCRIPTS
// ========================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:5000", "https://api.openweathermap.org", "ws://localhost:5000"],
            scriptSrcAttr: ["'unsafe-inline'"],
        },
    },
}));

app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Serve static files from frontend (FIXED for Render)
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mpraveenkumarone_db_user:Kumar008@cluster0.gokdntn.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    dbName: 'travelplanner'
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📀 Database: travelplanner');
})
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
});

// ============ API ROUTES ============

// Auth Routes (Register, Login, etc.)
app.use('/api/auth', authRoutes);

// Trip Routes (Create, Read, Update, Delete, Share)
app.use('/api/trips', tripRoutes);

// Weather Routes
app.use('/api/weather', weatherRoutes);

// Flight Routes
app.use('/api/flights', flightRoutes);

// ============ BASIC ROUTES ============

// Welcome route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to AI Travel Planner API', 
        status: 'running',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            trips: '/api/trips',
            weather: '/api/weather/:destination',
            flights: '/api/flights/:destination',
            health: '/api/health',
            sample: '/api/trips/sample'
        }
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Serve share page for share codes
app.get('/share/:code', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/share.html'));
});

// AI Test Route (Ollama)
app.post('/api/ai/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // Try to use Ollama, if not available return fallback
        try {
            const ollama = require('ollama');
            const response = await ollama.chat({
                model: 'llama2',
                messages: [{ role: 'user', content: prompt }]
            });
            res.json({ success: true, result: response.message.content });
        } catch (ollamaError) {
            // Fallback when Ollama is not running
            res.json({ 
                success: true, 
                result: `✨ AI Generated Itinerary for: ${prompt}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📅 DAY 1: Arrival & Exploration\n• Check into your hotel\n• Visit main attractions\n• Try local cuisine for dinner\n💰 Estimated: $50-100\n\n📅 DAY 2: Cultural Experience\n• Morning: Historical sites\n• Afternoon: Museum tour\n• Evening: Cultural show\n💰 Estimated: $60-120\n\n📅 DAY 3: Adventure Day\n• Outdoor activities\n• Hidden gems tour\n• Sunset viewing spot\n💰 Estimated: $70-150\n\n📅 DAY 4: Food & Shopping\n• Food tour\n• Local markets\n• Souvenir shopping\n💰 Estimated: $40-80\n\n📅 DAY 5: Relax & Departure\n• Last-minute sightseeing\n• Airport transfer\n• Departure\n💰 Estimated: $30-60\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Pro Tips:\n• Book hotels in advance for better rates\n• Learn a few local phrases\n• Download offline maps\n• Check weather before packing\n• Get travel insurance\n\n💡 Tip: Install Ollama (ollama.ai) and run 'ollama run llama2' for real AI responses!`
            });
        }
    } catch (error) {
        console.error('AI error:', error);
        res.json({ 
            success: true, 
            result: `📝 Sample itinerary for: ${req.body.prompt}\n\nThis is a demo response. Start Ollama with 'ollama run llama2' for AI-powered results!\n\nDay 1: Arrival and check-in\nDay 2: Explore local attractions\nDay 3: Cultural experiences\nDay 4: Food tour\nDay 5: Departure\n\n💡 Tip: Install Ollama for real AI responses!`
        });
    }
});

// Sample Trip Data (Public - No Auth Required)
const sampleTrips = [
    { 
        id: 1, 
        destination: 'Paris, France', 
        days: 5, 
        budget: 1200, 
        description: 'Eiffel Tower, Louvre Museum, French cuisine, Seine River cruise',
        image: '🗼',
        bestTime: 'April-June, September-October'
    },
    { 
        id: 2, 
        destination: 'Tokyo, Japan', 
        days: 7, 
        budget: 2000, 
        description: 'Sushi, temples, Shibuya crossing, Mt. Fuji day trip',
        image: '🗻',
        bestTime: 'March-May, September-November'
    },
    { 
        id: 3, 
        destination: 'New York, USA', 
        days: 4, 
        budget: 1500, 
        description: 'Times Square, Broadway, Central Park, Statue of Liberty',
        image: '🗽',
        bestTime: 'April-June, September-November'
    },
    { 
        id: 4, 
        destination: 'Bali, Indonesia', 
        days: 6, 
        budget: 800, 
        description: 'Beaches, rice terraces, temples, yoga retreats',
        image: '🏝️',
        bestTime: 'April-October'
    },
    { 
        id: 5, 
        destination: 'Rome, Italy', 
        days: 5, 
        budget: 1100, 
        description: 'Colosseum, Vatican City, pasta, gelato, ancient ruins',
        image: '🏛️',
        bestTime: 'April-June, September-October'
    },
    { 
        id: 6, 
        destination: 'London, UK', 
        days: 5, 
        budget: 1300, 
        description: 'Big Ben, London Eye, Buckingham Palace, British Museum',
        image: '🇬🇧',
        bestTime: 'May-September'
    },
    { 
        id: 7, 
        destination: 'Dubai, UAE', 
        days: 4, 
        budget: 1800, 
        description: 'Burj Khalifa, Desert safari, Shopping malls',
        image: '🏜️',
        bestTime: 'November-March'
    },
    { 
        id: 8, 
        destination: 'Bangkok, Thailand', 
        days: 5, 
        budget: 700, 
        description: 'Temples, Street food, Night markets, Floating markets',
        image: '🛶',
        bestTime: 'November-February'
    }
];

app.get('/api/trips/sample', (req, res) => {
    res.json(sampleTrips);
});

// Simple save trip without auth (for testing)
app.post('/api/trips/save-test', async (req, res) => {
    try {
        const { destination, days, budget, interests, cuisine, itinerary } = req.body;
        
        const db = mongoose.connection.db;
        const collection = db.collection('trips');
        
        const trip = {
            destination,
            days,
            budget,
            interests,
            cuisine,
            itinerary,
            createdAt: new Date(),
            userId: 'test-user'
        };
        
        const result = await collection.insertOne(trip);
        res.json({ success: true, message: 'Trip saved!', id: result.insertedId });
    } catch (error) {
        console.error('Error saving trip:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all trips (public - for testing)
app.get('/api/trips/all', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collection = db.collection('trips');
        const trips = await collection.find({}).toArray();
        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 AI Travel Planner Server Running!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`✈️ Sample Trips: http://localhost:${PORT}/api/trips/sample`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`📝 Trips API: http://localhost:${PORT}/api/trips`);
    console.log(`🌤️ Weather API: http://localhost:${PORT}/api/weather/paris`);
    console.log(`✈️ Flights API: http://localhost:${PORT}/api/flights/paris`);
    console.log(`👤 Profile: http://localhost:${PORT}/pages/profile.html`);
    console.log(`🔗 Share: http://localhost:${PORT}/share/[code]`);
    console.log(`💾 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
    console.log(`\n📋 Available Endpoints:`);
    console.log(`   POST   /api/auth/register     - Create account`);
    console.log(`   POST   /api/auth/login        - Login`);
    console.log(`   GET    /api/auth/me           - Get user info`);
    console.log(`   POST   /api/trips             - Create trip (Auth required)`);
    console.log(`   GET    /api/trips/my-trips    - Get user trips (Auth required)`);
    console.log(`   POST   /api/ai/generate       - Generate itinerary`);
    console.log(`   GET    /api/weather/:city     - Get weather forecast`);
    console.log(`   GET    /api/flights/:city     - Get flight deals`);
    console.log(`   GET    /share/:code           - View shared trip`);
    console.log(`\n✨ Ready for requests!\n`);
});