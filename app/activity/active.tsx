import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { saveActivity } from '@/services/storage';

import { saveActivityToCloud } from '@/services/cloudActivities';

import ActivityMap from '@/components/ActivityMap';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

import {
  getCurrentLocation,
  requestLocationPermission,
  watchUserLocation,
} from '@/services/location';

import type {
  ActivityType,
  RoutePoint,
  StoredActivity,
} from '@/types/activity';

import { useAuth } from '@/hooks/useAuth';

export default function ActiveActivityScreen() {
  const router = useRouter();

  const { user } = useAuth();

  const params = useLocalSearchParams<{
    type?: string;
  }>();

  const { theme } = useAppTheme();
  const colors = Colors[theme];

  const subscriptionRef = useRef<{
    remove: () => void;
  } | null>(null);

  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [currentPosition, setCurrentPosition] =
    useState<RoutePoint | null>(null);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startedAt] = useState(Date.now());

  const activityType = useMemo<ActivityType>(() => {
    if (params.type === 'run') return 'run';
    if (params.type === 'bike') return 'bike';

    return 'walk';
  }, [params.type]);

  useEffect(() => {
    let mounted = true;

    const startLocationTracking = async () => {
      const granted = await requestLocationPermission();

      if (!mounted) return;

      if (!granted) {
        setLoadingLocation(false);

        Alert.alert(
          'Permiso necesario',
          'MoveMate necesita acceso a tu ubicación para registrar la actividad.'
        );

        return;
      }

      setPermissionGranted(true);

      try {
        const initialLocation = await getCurrentLocation();

        if (!mounted) return;

        const initialPoint: RoutePoint = {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          timestamp: initialLocation.timestamp,
        };

        setCurrentPosition(initialPoint);
        setRoute([initialPoint]);

        subscriptionRef.current = await watchUserLocation((location) => {
          const point: RoutePoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
          };

          setCurrentPosition(point);

          setRoute((currentRoute) => {
            const lastPoint = currentRoute[currentRoute.length - 1];

            if (
              lastPoint &&
              lastPoint.latitude === point.latitude &&
              lastPoint.longitude === point.longitude
            ) {
              return currentRoute;
            }

            return [...currentRoute, point];
          });
        });
      } catch {
        Alert.alert(
          'Error de ubicación',
          'No se pudo obtener la ubicación actual.'
        );
      } finally {
        if (mounted) {
          setLoadingLocation(false);
        }
      }
    };

    startLocationTracking();

    return () => {
      mounted = false;

      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(
        Math.floor((Date.now() - startedAt) / 1000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [startedAt]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((value) => value.toString().padStart(2, '0'))
      .join(':');
  };

  const calculateDistance = () => {
    if (route.length < 2) return 0;

    let total = 0;

    for (let i = 1; i < route.length; i += 1) {
      total += distanceBetweenPoints(
        route[i - 1],
        route[i]
      );
    }

    return total;
  };

  const distanceKm = calculateDistance();

  const calories = Math.round(
    distanceKm *
      (activityType === 'bike'
        ? 35
        : activityType === 'run'
          ? 70
          : 50)
  );

  const handleFinish = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    Alert.alert(
      'Finalizar actividad',
      `Tiempo: ${formatTime(elapsedSeconds)}\nDistancia: ${distanceKm.toFixed(
        2
      )} km\nCalorías: ${calories} kcal`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Guardar',
          onPress: async () => {
            const activity: StoredActivity = {
              id: `${startedAt}-${Date.now()}`,
              type: activityType,
              startedAt,
              finishedAt: Date.now(),
              durationSeconds: elapsedSeconds,
              distanceKm,
              calories,
              route,
            };

            try {
              await saveActivity(
                activity,
                user?.uid
              );

              if (user) {
                try {
                  await saveActivityToCloud(
                    activity,
                    user.uid
                  );
                } catch (error) {
                  console.error(
                    'Error al sincronizar con Firebase:',
                    error
                  );
                }
              }

              router.replace('/');

              Alert.alert(
                'Actividad guardada',
                'La actividad fue agregada al historial.'
              );
            } catch {
              Alert.alert(
                'Error',
                'No se pudo guardar la actividad.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.mapContainer}>
        <ActivityMap
          currentPosition={currentPosition}
          route={route}
          primaryColor={colors.primary}
        />
        
        {loadingLocation ? (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>
              Obteniendo ubicación...
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={[
          styles.infoPanel,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.activityLabel,
            {
              color: colors.primary,
            },
          ]}
        >
          {getActivityLabel(activityType)}
        </Text>

        <Text style={[styles.timer, { color: colors.text }]}>
          {formatTime(elapsedSeconds)}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {distanceKm.toFixed(2)}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              km
            </Text>
          </View>

          <View style={styles.stat}>
            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {calories}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              kcal
            </Text>
          </View>

          <View style={styles.stat}>
            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {route.length}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              puntos
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.finishButton,
            {
              backgroundColor: colors.danger,
            },
          ]}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>
            Finalizar actividad
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function getActivityLabel(type: ActivityType) {
  switch (type) {
    case 'run':
      return 'Carrera';

    case 'bike':
      return 'Bicicleta';

    default:
      return 'Caminata';
  }
}

function distanceBetweenPoints(
  pointA: RoutePoint,
  pointB: RoutePoint
) {
  const earthRadiusKm = 6371;

  const lat1 = degreesToRadians(pointA.latitude);
  const lat2 = degreesToRadians(pointB.latitude);

  const deltaLat = degreesToRadians(
    pointB.latitude - pointA.latitude
  );

  const deltaLon = degreesToRadians(
    pointB.longitude - pointA.longitude
  );

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
}

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapContainer: {
    flex: 1,
  },

  loadingOverlay: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  loadingText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  infoPanel: {
    padding: 22,
    borderTopWidth: 1,
  },

  activityLabel: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },

  timer: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },

  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },

  finishButton: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },

  finishButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});