import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {
  AppThemeProvider,
  useAppTheme,
} from '@/hooks/useAppTheme';

import { AuthProvider } from '@/hooks/useAuth';

function AppNavigation() {
  const { theme } = useAppTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      <StatusBar
        style={theme === 'dark' ? 'light' : 'dark'}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}