/**
 * Database seed configuration for CoffeesIQ
 * This file contains default data that can be used to seed the database
 */

export const databaseConfig = {
  // Default flavor notes that will be seeded to the database
  flavorNotes: [
    { name: 'Chocolate', category: 'sweet' },
    { name: 'Caramel', category: 'sweet' },
    { name: 'Honey', category: 'sweet' },
    { name: 'Vanilla', category: 'sweet' },
    { name: 'Brown Sugar', category: 'sweet' },
    { name: 'Molasses', category: 'sweet' },
    { name: 'Nutty', category: 'nutty' },
    { name: 'Almond', category: 'nutty' },
    { name: 'Hazelnut', category: 'nutty' },
    { name: 'Peanut', category: 'nutty' },
    { name: 'Fruity', category: 'fruity' },
    { name: 'Citrus', category: 'fruity' },
    { name: 'Lemon', category: 'fruity' },
    { name: 'Orange', category: 'fruity' },
    { name: 'Berry', category: 'fruity' },
    { name: 'Blueberry', category: 'fruity' },
    { name: 'Strawberry', category: 'fruity' },
    { name: 'Cherry', category: 'fruity' },
    { name: 'Apple', category: 'fruity' },
    { name: 'Tropical', category: 'fruity' },
    { name: 'Floral', category: 'floral' },
    { name: 'Jasmine', category: 'floral' },
    { name: 'Rose', category: 'floral' },
    { name: 'Lavender', category: 'floral' },
    { name: 'Spice', category: 'spicy' },
    { name: 'Cinnamon', category: 'spicy' },
    { name: 'Clove', category: 'spicy' },
    { name: 'Black Pepper', category: 'spicy' },
    { name: 'Earthy', category: 'earthy' },
    { name: 'Woody', category: 'earthy' },
    { name: 'Smoky', category: 'earthy' },
    { name: 'Tobacco', category: 'earthy' },
    { name: 'Herbal', category: 'herbal' },
    { name: 'Grassy', category: 'herbal' },
    { name: 'Tea-like', category: 'herbal' },
    { name: 'Vegetal', category: 'herbal' },
    { name: 'Savory', category: 'savory' },
    { name: 'Toasty', category: 'savory' },
    { name: 'Malty', category: 'savory' },
    { name: 'Cereal', category: 'savory' }
  ],
  
  // Default quiz questions for coffee preference quiz
  quizQuestions: [
    {
      questionId: 'roast-preference',
      question: 'What roast level do you typically enjoy?',
      description: 'This helps us understand your baseline preference for coffee intensity.',
      answerType: 'single',
      options: [
        { id: 'light', text: 'Light Roast', value: 'light', icon: 'LightModeIcon' },
        { id: 'medium', text: 'Medium Roast', value: 'medium', icon: 'AdjustIcon' },
        { id: 'dark', text: 'Dark Roast', value: 'dark', icon: 'DarkModeIcon' },
        { id: 'any', text: 'I enjoy variety', value: 'any', icon: 'ShuffleIcon' }
      ]
    },
    {
      questionId: 'flavor-preference',
      question: 'Which flavor profiles do you prefer?',
      description: 'Select all that appeal to you.',
      answerType: 'multiple',
      options: [
        { id: 'sweet', text: 'Sweet (chocolate, caramel, honey)', value: 'sweet', icon: 'CandyBarIcon' },
        { id: 'fruity', text: 'Fruity (berries, citrus, stone fruit)', value: 'fruity', icon: 'LocalFloristIcon' },
        { id: 'nutty', text: 'Nutty (almond, hazelnut, peanut)', value: 'nutty', icon: 'EggAltIcon' },
        { id: 'spicy', text: 'Spicy (cinnamon, clove, pepper)', value: 'spicy', icon: 'LocalFireDepartmentIcon' },
        { id: 'floral', text: 'Floral (jasmine, rose, lavender)', value: 'floral', icon: 'YardIcon' },
        { id: 'earthy', text: 'Earthy (woody, smoky, tobacco)', value: 'earthy', icon: 'ForestIcon' }
      ]
    },
    {
      questionId: 'brewing-method',
      question: 'What\'s your primary brewing method?',
      description: 'Different brewing methods extract different characteristics.',
      answerType: 'single',
      options: [
        { id: 'espresso', text: 'Espresso Machine', value: 'espresso', icon: 'CoffeeMakerIcon' },
        { id: 'pourover', text: 'Pour Over / Drip', value: 'pourover', icon: 'CoffeeIcon' },
        { id: 'french', text: 'French Press', value: 'french', icon: 'BreakfastDiningIcon' },
        { id: 'aeropress', text: 'AeroPress', value: 'aeropress', icon: 'FilterAltIcon' },
        { id: 'cold', text: 'Cold Brew', value: 'cold', icon: 'AcUnitIcon' },
        { id: 'other', text: 'Other / Multiple Methods', value: 'other', icon: 'MoreHorizIcon' }
      ]
    },
    {
      questionId: 'time-preference',
      question: 'When do you usually drink coffee?',
      description: 'Time of day can influence your flavor preferences.',
      answerType: 'single',
      options: [
        { id: 'morning', text: 'Morning', value: 'morning', icon: 'WbSunnyIcon' },
        { id: 'afternoon', text: 'Afternoon', value: 'afternoon', icon: 'WbTwilightIcon' },
        { id: 'evening', text: 'Evening', value: 'evening', icon: 'DarkModeIcon' },
        { id: 'anytime', text: 'Throughout the day', value: 'anytime', icon: 'AccessTimeIcon' }
      ]
    },
    {
      questionId: 'caffeine-preference',
      question: 'What\'s your caffeine preference?',
      description: 'We can recommend based on caffeine content.',
      answerType: 'single',
      options: [
        { id: 'regular', text: 'Regular caffeine', value: 'regular', icon: 'BatteryFullIcon' },
        { id: 'low', text: 'Low caffeine', value: 'low', icon: 'BatteryCharging50Icon' },
        { id: 'decaf', text: 'Decaf only', value: 'decaf', icon: 'BatteryCharging20Icon' },
        { id: 'any', text: 'No preference', value: 'any', icon: 'AllInclusiveIcon' }
      ]
    }
  ],
  
  // Default mascot guides for different app sections
  mascotGuides: [
    {
      name: 'home-first-visit',
      message: 'Welcome to CoffeesIQ! I\'m your coffee companion. Explore coffees, track your tastings, and discover new favorites. Ready to start your journey?',
      mood: 'excited',
      position: 'bottom-right',
      priority: 10,
      autoHide: true,
      hideAfter: 10000,
    },
    {
      name: 'add-coffee-scanner',
      message: 'You can quickly add coffees by scanning their barcode! Position the barcode in the center of the camera view.',
      mood: 'explaining',
      position: 'top-right',
      priority: 5,
      autoHide: true,
      hideAfter: 8000,
    },
    {
      name: 'flavor-selection',
      message: 'Identifying flavor notes helps you track what you enjoy. Click on any flavors you detect in this coffee.',
      mood: 'thinking',
      position: 'top-right',
      priority: 5,
      autoHide: true,
      hideAfter: 8000,
    },
    {
      name: 'review-guide',
      message: 'Great reviews include details about aroma, flavor, body, and acidity. What stood out to you about this coffee?',
      mood: 'explaining',
      position: 'top-left',
      priority: 5,
      autoHide: true,
      hideAfter: 8000,
    },
    {
      name: 'discover-page',
      message: 'Here you\'ll find coffees tailored to your preferences. The more you review, the better our recommendations get!',
      mood: 'happy',
      position: 'bottom-right',
      priority: 7,
      autoHide: true,
      hideAfter: 8000,
    },
    {
      name: 'profile-collections',
      message: 'Create collections to organize coffees by region, roaster, or flavor profile. It\'s a great way to track what you love!',
      mood: 'waving',
      position: 'bottom-left',
      priority: 3,
      autoHide: true,
      hideAfter: 8000,
    }
  ],
  
  // Default shop products 
  shopProducts: [
    {
      name: 'Light Roast Sampler',
      description: 'A curated collection of exceptional light roast beans from around the world.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c8?q=80&w=2940&auto=format&fit=crop',
      category: 'Samplers',
      featured: true,
      inStock: true,
      externalUrl: 'https://example.com/shop/light-roast-sampler'
    },
    {
      name: 'Ethiopian Yirgacheffe',
      description: 'Vibrant, floral, and citrusy. A bright coffee with jasmine and lemon notes.',
      price: 18.99,
      imageUrl: 'https://images.unsplash.com/photo-1580933073521-dc49ac0c7e79?q=80&w=2940&auto=format&fit=crop',
      category: 'Single Origin',
      featured: true,
      inStock: true,
      externalUrl: 'https://example.com/shop/ethiopian-yirgacheffe'
    },
    {
      name: 'Ceramic Pour-Over Dripper',
      description: 'Hand-crafted ceramic pour-over cone for precision brewing.',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1544778464-cf1064485269?q=80&w=2877&auto=format&fit=crop',
      category: 'Equipment',
      featured: true,
      inStock: true,
      externalUrl: 'https://example.com/shop/ceramic-pour-over'
    },
    {
      name: 'Coffee Tasting Journal',
      description: 'Document your coffee journey with this beautiful tasting journal.',
      price: 19.99,
      imageUrl: 'https://images.unsplash.com/photo-1598524409075-b7eec5e82f0c?q=80&w=2942&auto=format&fit=crop',
      category: 'Accessories',
      featured: false,
      inStock: true,
      externalUrl: 'https://example.com/shop/tasting-journal'
    },
    {
      name: 'Digital Coffee Scale',
      description: 'Precise to 0.1g for consistent brewing results every time.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1515283736202-dae2a9fcebcd?q=80&w=2940&auto=format&fit=crop',
      category: 'Equipment',
      featured: false,
      inStock: true,
      externalUrl: 'https://example.com/shop/digital-scale'
    }
  ]
};

export default databaseConfig;