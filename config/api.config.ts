/**
 * API configuration for CoffeesIQ
 */

export const apiConfig = {
  // External API endpoints
  endpoints: {
    // Coffee database API (example)
    coffeeDatabaseApi: process.env.COFFEE_DB_API_URL || 'https://api.example.com/coffee',
    
    // Shopify integration
    shopify: {
      baseUrl: process.env.SHOPIFY_API_URL,
      apiVersion: '2023-10',
    },
    
    // Barcode lookup API
    barcodeApi: process.env.BARCODE_API_URL,
  },
  
  // Rate limiting settings
  rateLimits: {
    defaultLimit: 100, // requests per period
    period: 3600,      // in seconds (1 hour)
  },
  
  // API request timeout
  timeout: 30000, // 30 seconds in milliseconds
};

export default apiConfig;