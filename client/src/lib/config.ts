/**
 * Configuration access utility
 * This file provides helper functions to access configuration values throughout the application
 */

import themeConfig from '../../../config/theme.config';
import contentConfig from '../../../config/content.config';
import appConfig from '../../../config/app.config';

/**
 * Get a value from the theme configuration
 * @param path Dot-notation path to the config value (e.g., 'colors.coffeeBrown')
 * @param defaultValue Optional default value if the path doesn't exist
 */
export function getTheme<T>(path: string, defaultValue?: T): T {
  return getConfigValue<T>(themeConfig, path, defaultValue);
}

/**
 * Get a value from the content configuration
 * @param path Dot-notation path to the config value (e.g., 'app.name')
 * @param defaultValue Optional default value if the path doesn't exist
 */
export function getContent<T>(path: string, defaultValue?: T): T {
  return getConfigValue<T>(contentConfig, path, defaultValue);
}

/**
 * Get a value from the app configuration
 * @param path Dot-notation path to the config value (e.g., 'features.socialLogin')
 * @param defaultValue Optional default value if the path doesn't exist
 */
export function getAppConfig<T>(path: string, defaultValue?: T): T {
  return getConfigValue<T>(appConfig, path, defaultValue);
}

/**
 * Helper function to get a nested value from an object using dot notation
 */
function getConfigValue<T>(obj: any, path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null || typeof result !== 'object') {
      return defaultValue as T;
    }
    result = result[key];
  }
  
  return (result !== undefined ? result : defaultValue) as T;
}

/**
 * Check if a feature is enabled
 * @param featureName Name of the feature to check
 */
export function isFeatureEnabled(featureName: string): boolean {
  return getAppConfig<boolean>(`features.${featureName}`, false);
}

/**
 * Get an app-wide label (button, action, etc.)
 * @param labelKey Key of the label to retrieve
 * @param defaultValue Optional default value if the key doesn't exist
 */
export function getLabel(labelKey: string, defaultValue: string = labelKey): string {
  return getContent<string>(`actions.${labelKey}`, defaultValue);
}

/**
 * Get all values in a specific section of the configuration
 * @param section Section path in dot notation (e.g., 'coffee.roastLevels') 
 */
export function getConfigSection<T>(section: string): T {
  if (section.startsWith('theme.')) {
    return getTheme<T>(section.substring(6));
  } else if (section.startsWith('content.')) {
    return getContent<T>(section.substring(8));
  } else if (section.startsWith('app.')) {
    return getAppConfig<T>(section.substring(4));
  }
  
  // Try to find in each config
  const themeValue = getTheme<T>(section);
  if (themeValue !== undefined) return themeValue;
  
  const contentValue = getContent<T>(section);
  if (contentValue !== undefined) return contentValue;
  
  return getAppConfig<T>(section);
}