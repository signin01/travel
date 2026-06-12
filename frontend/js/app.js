// Main Application Entry Point
// Note: Most functionality is in index.html
// This file serves as a module loader and utility functions

class TravelApp {
    constructor() {
        this.apiBase = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        this.checkServerHealth();
        this.setupEventListeners();
        this.loadUserData();
    }

    async checkServerHealth() {
        try {
            const response = await fetch(${this.apiBase}/health);
            const data = await response.json();
            console.log('✅ Server status:', data.status);
            return true;
        } catch (error) {
            console.warn('⚠️ Server not running. Start with: npm run dev');
            return false;
        }
    }

    setupEventListeners() {
        // Global error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });

        // Online/Offline detection
        window.addEventListener('online', () => {
            this.showNotification('Back online!', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('You are offline. Some features may be limited.', 'warning');
        });
    }

    loadUserData() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            console.log('👤 User logged in:', JSON.parse(user).name);
        }
    }

    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = 'rgba(0,0,0,0.8)';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '50px';
        toast.style.zIndex = '9999';
        
        if (type === 'success') toast.style.borderLeft = '4px solid #00b894';
        if (type === 'error') toast.style.borderLeft = '4px solid #ff6b6b';
        if (type === 'warning') toast.style.borderLeft = '4px solid #ffd89b';
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.travelApp = new TravelApp();
    console.log('🚀 AI Travel Planner App Loaded');
});
