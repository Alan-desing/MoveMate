import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function HistoryScreen() {
  const { theme } = useAppTheme();

  const colors = Colors[theme];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Historial
      </Text>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Tus actividades realizadas aparecerán acá.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
  },

  description: {
    marginTop: 10,
    fontSize: 15,
  },
});