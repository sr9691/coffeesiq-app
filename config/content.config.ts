/**
 * Content configuration for CoffeesIQ
 * This file contains all configurable text and content elements used throughout the app
 */

export const contentConfig = {
  // General app content
  app: {
    name: 'CoffeesIQ',
    tagline: 'Discover, rate and share your coffee journey',
    description: 'A sophisticated coffee enthusiast platform that enables users to explore, rate, and connect over coffee beans through an interactive and social experience.',
    copyright: `© ${new Date().getFullYear()} CoffeesIQ. All rights reserved.`,
    version: '1.0.0',
  },
  
  // Navigation labels
  navigation: {
    home: 'Home',
    discover: 'Discover',
    add: 'Add Coffee',
    profile: 'Profile',
    collections: 'Collections',
    shop: 'Shop',
    social: 'Community',
    settings: 'Settings',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
  },
  
  // Button and action labels
  actions: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    upload: 'Upload',
    scan: 'Scan',
    rate: 'Rate',
    review: 'Review',
    share: 'Share',
    favorite: 'Favorite',
    unfavorite: 'Remove Favorite',
    follow: 'Follow',
    unfollow: 'Unfollow',
  },
  
  // Form labels and placeholders
  form: {
    username: {
      label: 'Username',
      placeholder: 'Enter your username',
    },
    email: {
      label: 'Email',
      placeholder: 'Enter your email address',
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
    },
    confirmPassword: {
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
    },
    name: {
      label: 'Name',
      placeholder: 'Enter name',
    },
    origin: {
      label: 'Origin',
      placeholder: 'Country or region of origin',
    },
    roaster: {
      label: 'Roaster',
      placeholder: 'Who roasted this coffee?',
    },
    roastLevel: {
      label: 'Roast Level',
      placeholder: 'Select roast level',
      options: ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'],
    },
    review: {
      label: 'Your Review',
      placeholder: 'What did you think about this coffee?',
    },
    flavorNotes: {
      label: 'Flavor Notes',
      placeholder: 'Select flavor notes',
    },
    imageUrl: {
      label: 'Image URL',
      placeholder: 'Enter image URL',
    },
    barcode: {
      label: 'Barcode',
      placeholder: 'Enter barcode number',
    },
  },
  
  // Error messages
  errors: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordMismatch: 'Passwords do not match',
    passwordLength: 'Password must be at least 8 characters',
    usernameExists: 'Username already exists',
    emailExists: 'Email address already exists',
    invalidLogin: 'Invalid username or password',
    serverError: 'Something went wrong. Please try again later.',
    notFound: 'Not found',
    unauthorized: 'You are not authorized to perform this action',
    invalidBarcode: 'Invalid barcode format',
    noResults: 'No results found',
  },
  
  // Success messages
  success: {
    login: 'Successfully logged in',
    register: 'Account created successfully',
    logout: 'Successfully logged out',
    passwordReset: 'Password reset email sent',
    passwordChanged: 'Password changed successfully',
    coffeeAdded: 'Coffee added successfully',
    reviewPosted: 'Review posted successfully',
    profileUpdated: 'Profile updated successfully',
  },
  
  // Page-specific content
  pages: {
    // Home page
    home: {
      welcomeHeading: 'Welcome to CoffeesIQ',
      welcomeText: 'Track your coffee journey, discover new beans, and connect with coffee enthusiasts.',
      featuredHeading: 'Featured Coffees',
      topRatedHeading: 'Top Rated',
      recentlyAddedHeading: 'Recently Added',
      yourActivityHeading: 'Your Activity',
    },
    
    // Coffee details page
    coffeeDetails: {
      reviewsHeading: 'Reviews',
      detailsHeading: 'Details',
      flavorNotesHeading: 'Flavor Notes',
      originLabel: 'Origin',
      roasterLabel: 'Roaster',
      roastLevelLabel: 'Roast Level',
      processMethodLabel: 'Process Method',
      writeReviewCta: 'Write a Review',
      noReviews: 'No reviews yet. Be the first to review!',
    },
    
    // Add coffee page
    addCoffee: {
      pageTitle: 'Add a New Coffee',
      barcodeTab: 'Scan Barcode',
      manualTab: 'Manual Entry',
      scanInstructions: 'Position the barcode in the center of the camera view',
      scanningStatus: 'Scanning...',
      scanFailure: 'Failed to scan barcode. Try again or enter manually.',
      basicInfoSection: 'Basic Information',
      detailsSection: 'Coffee Details',
      flavorSection: 'Flavor Profile',
      imageSection: 'Add Image',
    },
    
    // Review page
    review: {
      pageTitle: 'Write Review',
      ratingLabel: 'Your Rating',
      reviewLabel: 'Your Review',
      photoLabel: 'Add Photos',
      photoInstructions: 'Add photos of your brew',
      submitButton: 'Post Review',
      submittingStatus: 'Posting...',
    },
    
    // Profile page
    profile: {
      editProfile: 'Edit Profile',
      userSince: 'User since',
      followersLabel: 'Followers',
      followingLabel: 'Following',
      reviewsLabel: 'Reviews',
      coffeesLabel: 'Coffees',
      collectionsLabel: 'Collections',
      activityHeading: 'Recent Activity',
      noActivity: 'No recent activity',
    },
    
    // Settings page
    settings: {
      accountSection: 'Account Settings',
      profileSection: 'Profile Settings',
      notificationSection: 'Notification Settings',
      privacySection: 'Privacy Settings',
      themeSection: 'Theme Settings',
      deleteAccount: 'Delete Account',
      deleteWarning: 'This action cannot be undone. All your data will be permanently deleted.',
    },
    
    // Auth pages
    auth: {
      loginHeading: 'Login to Your Account',
      registerHeading: 'Create an Account',
      forgotPassword: 'Forgot Password?',
      newUser: 'New user?',
      alreadyHaveAccount: 'Already have an account?',
      signUpLink: 'Sign up',
      loginLink: 'Login',
      socialLoginHeading: 'Continue with',
      orDivider: 'OR',
      resetPasswordHeading: 'Reset Your Password',
      resetInstructions: 'Enter your email address and we\'ll send you a link to reset your password.',
      resetButton: 'Send Reset Link',
      backToLogin: 'Back to Login',
    },
    
    // Not found page
    notFound: {
      heading: 'Page Not Found',
      message: 'The page you are looking for does not exist or has been moved.',
      buttonText: 'Go Home',
    },
  },
  
  // Mascot messages and tips
  mascot: {
    greeting: 'Hi there! I\'m your coffee guide.',
    welcomeNewUser: 'Welcome to CoffeesIQ! I\'ll help you navigate the app and discover great coffee.',
    reviewPrompt: 'Ready to share your thoughts on this coffee? Writing a detailed review helps the community!',
    discoverTip: 'Looking for new coffees? Check out the Discover page for personalized recommendations.',
    scannerTip: 'Pro tip: Use the barcode scanner to quickly add coffees to your collection.',
    firstReviewCelebration: 'You posted your first review! Keep track of your coffee journey by adding more.',
    flavorWheelHelp: 'Not sure about flavor notes? Use the flavor wheel to explore taste characteristics.',
    quizSuggestion: 'Take our coffee preference quiz to get personalized recommendations!',
    
    tips: [
      {
        title: 'Tasting 101',
        content: 'When tasting coffee, focus on aroma, flavor, acidity, body, and aftertaste to develop your palate.'
      },
      {
        title: 'Storage Matters',
        content: 'Store coffee beans in an airtight container, away from light, heat, and moisture for maximum freshness.'
      },
      {
        title: 'Water Temperature',
        content: 'The ideal water temperature for brewing coffee is between 195°F and 205°F (90°C to 96°C).'
      },
      {
        title: 'Grind Size',
        content: 'Different brewing methods require different grind sizes: coarse for French press, medium for drip, fine for espresso.'
      },
      {
        title: 'Coffee Freshness',
        content: 'Coffee is best consumed within 2-4 weeks of its roast date for optimal flavor.'
      }
    ]
  },
  
  // FAQ content
  faq: [
    {
      question: 'What is CoffeesIQ?',
      answer: 'CoffeesIQ is a platform for coffee enthusiasts to discover, track, rate, and share their coffee experiences. It helps you find new coffees based on your preferences and connect with other coffee lovers.'
    },
    {
      question: 'How do I add a new coffee?',
      answer: 'You can add a new coffee by going to the "Add Coffee" page, either by scanning a barcode or entering details manually. Fill in the coffee information, add optional flavor notes and an image, then save.'
    },
    {
      question: 'What does the barcode scanner do?',
      answer: 'Our barcode scanner allows you to quickly add coffee by scanning its UPC barcode. The app will attempt to auto-fill details like name, roaster, and origin when available in our database.'
    },
    {
      question: 'How does the recommendation system work?',
      answer: 'CoffeesIQ recommends coffees based on your ratings, flavor preferences, and similar users\' favorites. The more you rate and review, the better our recommendations become.'
    },
    {
      question: 'Can I edit or delete my reviews?',
      answer: 'Yes, you can edit or delete your own reviews from the coffee details page or your profile page.'
    }
  ],
  
  // Coffee information
  coffee: {
    // Common roast levels
    roastLevels: [
      { value: 'light', label: 'Light Roast' },
      { value: 'medium-light', label: 'Medium-Light Roast' }, 
      { value: 'medium', label: 'Medium Roast' },
      { value: 'medium-dark', label: 'Medium-Dark Roast' },
      { value: 'dark', label: 'Dark Roast' }
    ],
    
    // Common processing methods
    processMethods: [
      { value: 'washed', label: 'Washed Process' },
      { value: 'natural', label: 'Natural Process' },
      { value: 'honey', label: 'Honey Process' },
      { value: 'anaerobic', label: 'Anaerobic Fermentation' },
      { value: 'wet-hulled', label: 'Wet-Hulled Process' }
    ],
    
    // Image alt text templates
    imageAlt: {
      default: 'CoffeesIQ',
      coffeeImage: '{name} from {roaster}',
      placeholderImage: 'CoffeesIQ coffee placeholder'
    },
    
    // Standard flavor notes (these can also be stored in the database)
    defaultFlavorNotes: [
      { id: 1, name: 'Chocolate', category: 'sweet' },
      { id: 2, name: 'Caramel', category: 'sweet' },
      { id: 3, name: 'Nutty', category: 'nutty' },
      { id: 4, name: 'Fruity', category: 'fruity' },
      { id: 5, name: 'Citrus', category: 'fruity' },
      { id: 6, name: 'Berry', category: 'fruity' },
      { id: 7, name: 'Floral', category: 'floral' },
      { id: 8, name: 'Berry', category: 'fruity' },
      { id: 9, name: 'Spice', category: 'spicy' },
      { id: 10, name: 'Earthy', category: 'earthy' }
    ]
  }
};

export default contentConfig;