import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

import { AppTheme } from '@/constants/theme';

const THEME_STORAGE_KEY = 'movemate_theme';

export function useAppTheme() {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<AppTheme>(
    systemTheme === 'light' ? 'light' : 'dark'
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        } else {
          setThemeState(systemTheme === 'light' ? 'light' : 'dark');
        }
      } catch {
        setThemeState(systemTheme === 'light' ? 'light' : 'dark');
      } finally {
        setLoaded(true);
      }
    };

    loadTheme();
  }, [systemTheme]);

  const setTheme = async (newTheme: AppTheme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    loaded,
    setTheme,
    toggleTheme,
  };
}