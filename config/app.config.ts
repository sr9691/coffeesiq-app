/**
 * Application-wide configuration
 */

export const appConfig = {
  // Application information
  appName: 'CoffeesIQ',
  appDescription: 'A sophisticated coffee enthusiast platform',
  appVersion: '1.0.0',
  
  // URLs and endpoints
  baseUrl: (typeof import.meta !== 'undefined' ? import.meta.env.VITE_BASE_URL : undefined) || 'http://localhost:5000',
  apiPrefix: '/api',
  
  // Authentication settings
  auth: {
    sessionSecret: (typeof import.meta !== 'undefined' ? import.meta.env.VITE_SESSION_SECRET : undefined) || 'coffeesiq-super-secret-key',
    sessionMaxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
    tokenExpiration: '7d', // 7 days
  },
  
  // Feature flags
  features: {
    socialLogin: false, // Enable/disable social login features
    barcodeScanner: true, // Enable/disable barcode scanning
    coffeeShop: true, // Enable/disable coffee shop feature
  }
};

export default appConfig;