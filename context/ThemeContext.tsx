// https://reactnative.dev/docs/usecolorscheme
// https://www.native-templates.com/docs/theming/theme-context
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  theme: typeof Colors.light;
  setMode: (mode: ThemeMode) => void;
};

const THEME_KEY = 'steadypace-theme';

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  isDark: false,
  theme: Colors.light,
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setModeState(saved);
        }
      } catch (e) {
        console.error('Failed to load theme:', e);
      }
    };
    void loadTheme();
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  };

  const isDark =
    mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ mode, isDark, theme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};