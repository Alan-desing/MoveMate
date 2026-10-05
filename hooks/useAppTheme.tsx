import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { AppTheme } from '@/constants/theme';

const THEME_STORAGE_KEY = 'movemate_theme';

type ThemeContextType = {
  theme: AppTheme;
  loaded: boolean;
  setTheme: (theme: AppTheme) => Promise<void>;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
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
  }, []);

  const setTheme = async (newTheme: AppTheme) => {
    setThemeState(newTheme);

    await AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      newTheme
    );
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        loaded,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useAppTheme debe utilizarse dentro de AppThemeProvider'
    );
  }

  return context;
}