import React, { createContext, useContext, ReactNode } from 'react';
import themeConfig from '../../../config/theme.config';
import contentConfig from '../../../config/content.config';
import appConfig from '../../../config/app.config';

// Define the shape of our context
interface ConfigContextType {
  theme: typeof themeConfig;
  content: typeof contentConfig;
  app: typeof appConfig;
}

// Create the context with default values
const ConfigContext = createContext<ConfigContextType>({
  theme: themeConfig,
  content: contentConfig,
  app: appConfig,
});

interface ConfigProviderProps {
  children: ReactNode;
  // Optional props to override default configs
  themeOverrides?: Partial<typeof themeConfig>;
  contentOverrides?: Partial<typeof contentConfig>;
  appOverrides?: Partial<typeof appConfig>;
}

export function ConfigProvider({
  children,
  themeOverrides = {},
  contentOverrides = {},
  appOverrides = {},
}: ConfigProviderProps) {
  // Merge default configs with any overrides
  const theme = { ...themeConfig, ...themeOverrides };
  const content = { ...contentConfig, ...contentOverrides };
  const app = { ...appConfig, ...appOverrides };

  return (
    <ConfigContext.Provider value={{ theme, content, app }}>
      {children}
    </ConfigContext.Provider>
  );
}

// Custom hook to use the config context
export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

// Custom hooks for specific config types
export function useTheme() {
  const { theme } = useConfig();
  return theme;
}

export function useContent() {
  const { content } = useConfig();
  return content;
}

export function useAppConfig() {
  const { app } = useConfig();
  return app;
}

export default ConfigContext;