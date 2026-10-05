import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuth } from '@/hooks/useAuth';

import {
  loginUser,
  logoutUser,
  registerUser,
} from '@/services/auth';

export default function ProfileScreen() {
  const {
    theme,
    toggleTheme,
  } = useAppTheme();

  const { user } = useAuth();

  const colors = Colors[theme];

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        'Datos incompletos',
        'Ingresá tu correo y contraseña.'
      );

      return;
    }

    try {
      setLoading(true);

      await loginUser(
        email,
        password
      );

      Alert.alert(
        'Sesión iniciada',
        'Tu cuenta fue conectada correctamente.'
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error',
        'No se pudo iniciar sesión. Revisá los datos ingresados.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert(
        'Datos incompletos',
        'Ingresá tu correo y contraseña.'
      );

      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Contraseña muy corta',
        'La contraseña debe tener al menos 6 caracteres.'
      );

      return;
    }

    try {
      setLoading(true);

      await registerUser(
        email,
        password
      );

      Alert.alert(
        'Cuenta creada',
        'Tu cuenta fue creada correctamente.'
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error',
        'No se pudo crear la cuenta.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      Alert.alert(
        'Error',
        'No se pudo cerrar la sesión.'
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Perfil
      </Text>

      <Text
        style={[
          styles.description,
          {
            color:
              colors.textSecondary,
          },
        ]}
      >
        Configuración y sincronización de MoveMate
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <View
          style={styles.themeInfo}
        >
          <Ionicons
            name={
              theme === 'dark'
                ? 'moon-outline'
                : 'sunny-outline'
            }
            size={26}
            color={colors.primary}
          />

          <View>
            <Text
              style={[
                styles.optionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Apariencia
            </Text>

            <Text
              style={[
                styles.optionSubtitle,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Tema actual:{' '}
              {theme === 'dark'
                ? 'Oscuro'
                : 'Claro'}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.button,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
          onPress={toggleTheme}
        >
          <Text
            style={styles.buttonText}
          >
            Cambiar tema
          </Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.optionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Sincronización cloud
        </Text>

        {user ? (
          <>
            <Text
              style={[
                styles.optionSubtitle,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Conectado como:
            </Text>

            <Text
              style={[
                styles.email,
                {
                  color:
                    colors.primary,
                },
              ]}
            >
              {user.email}
            </Text>

            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor:
                    colors.danger,
                },
              ]}
              onPress={handleLogout}
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                Cerrar sesión
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              placeholderTextColor={
                colors.textSecondary
              }
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor:
                    colors.border,
                  backgroundColor:
                    colors.background,
                },
              ]}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              placeholderTextColor={
                colors.textSecondary
              }
              secureTextEntry
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor:
                    colors.border,
                  backgroundColor:
                    colors.background,
                },
              ]}
            />

            <Pressable
              disabled={loading}
              style={[
                styles.button,
                {
                  backgroundColor:
                    colors.primary,
                  opacity: loading
                    ? 0.6
                    : 1,
                },
              ]}
              onPress={handleLogin}
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                {loading
                  ? 'Procesando...'
                  : 'Iniciar sesión'}
              </Text>
            </Pressable>

            <Pressable
              disabled={loading}
              style={[
                styles.secondaryButton,
                {
                  borderColor:
                    colors.border,
                },
              ]}
              onPress={handleRegister}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: '700',
                }}
              >
                Crear cuenta
              </Text>
            </Pressable>
          </>
        )}
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
    marginBottom: 16,
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
    marginTop: 4,
    fontSize: 13,
  },

  email: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
  },

  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 12,
  },

  button: {
    marginTop: 16,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 14,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  secondaryButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
  },
});