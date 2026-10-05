import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppThemeProvider, useAppTheme } from '@/hooks/useAppTheme';

function AppNavigation() {
  const { theme } = useAppTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />

      <StatusBar
        style={theme === 'dark' ? 'light' : 'dark'}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AppNavigation />
    </AppThemeProvider>
  );
}