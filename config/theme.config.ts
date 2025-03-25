/**
 * Theme configuration for CoffeesIQ
 * This is the central configuration file for all visual aspects of the application
 */

export const themeConfig = {
  // Color palette - all colors used throughout the app should reference these values
  colors: {
    // Primary coffee theme colors
    coffeeBrown: '#4A3728',    // Deep brown for primary elements and text
    coffeeRed: '#9E2B25',      // Red accent for interactive elements
    coffeeGreen: '#3F5E2C',    // Green for flavor notes and environmental indicators
    coffeeCream: '#E4DFCA',    // Light beige for backgrounds, borders
    coffeeLight: '#F3F1E9',    // Very light cream for page backgrounds
    espresso: '#1F1A17',       // Dark brown/black for text and deep accents
    milky: '#F9F6F0',          // Almost white for light text and highlights
    
    // Functional/feedback colors
    success: '#4CAF50',        // Green for success states
    error: '#F44336',          // Red for error states
    warning: '#FF9800',        // Orange for warning states
    info: '#2196F3',           // Blue for information states
  },
  
  // Font settings
  typography: {
    primaryFont: "'Inter', sans-serif",
    headingFont: "'Poppins', sans-serif", 
    monoFont: "'Roboto Mono', monospace",
    baseFontSize: '16px',
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    }
  },
  
  // Border radius values
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    md: '0.25rem',     // 4px
    lg: '0.5rem',      // 8px
    xl: '1rem',        // 16px
    full: '9999px',    // Circular
  },
  
  // Spacing scale (margin, padding)
  spacing: {
    0: '0',
    1: '0.25rem',      // 4px
    2: '0.5rem',       // 8px
    3: '0.75rem',      // 12px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    8: '2rem',         // 32px
    10: '2.5rem',      // 40px
    12: '3rem',        // 48px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
  },
  
  // Animation timings
  animation: {
    fast: '0.15s',
    medium: '0.3s',
    slow: '0.5s',
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
  
  // Responsive breakpoints
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Shadow values
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Z-index scale
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: 'auto',
  },
  
  // Custom elements
  elements: {
    // Mascot appearance
    mascot: {
      primaryColor: '#4A3728',
      secondaryColor: '#E4DFCA',
      accentColor: '#9E2B25',
      expressions: ['happy', 'excited', 'thinking', 'sleeping', 'explaining', 'waving'],
      defaultExpression: 'happy',
    },
    
    // Button styles
    button: {
      primaryColor: '#4A3728',
      primaryHoverColor: '#5D4A3A',
      textColor: '#F3F1E9',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
    },
    
    // Card styles
    card: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E4DFCA',
      borderRadius: '0.5rem',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    
    // Form element styles
    form: {
      inputBorderColor: '#E4DFCA',
      inputFocusColor: '#4A3728',
      placeholderColor: 'rgba(74, 55, 40, 0.5)',
      errorColor: '#F44336',
    }
  }
};

// Export the theme configuration
export default themeConfig;