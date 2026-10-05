import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ProfileScreen() {
  const { theme, toggleTheme } = useAppTheme();

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
        Perfil
      </Text>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Configuración de MoveMate
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.themeInfo}>
          <Ionicons
            name={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
            size={26}
            color={colors.primary}
          />

          <View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>
              Apariencia
            </Text>

            <Text
              style={[
                styles.optionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Tema actual: {theme === 'dark' ? 'Oscuro' : 'Claro'}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.themeButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={toggleTheme}
        >
          <Text style={styles.themeButtonText}>
            Cambiar tema
          </Text>
        </Pressable>
      </View>
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
    marginTop: 6,
    marginBottom: 24,
    fontSize: 15,
  },

  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },

  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  optionSubtitle: {
    marginTop: 3,
    fontSize: 13,
  },

  themeButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
  },

  themeButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});