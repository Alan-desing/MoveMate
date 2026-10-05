import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type {
  ActivityType,
  StoredActivity,
} from '@/types/activity';

type Props = {
  activity: StoredActivity;
  onDelete: (id: string) => void;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    danger: string;
  };
};

const DELETE_THRESHOLD = -100;

export default function ActivityHistoryCard({
  activity,
  onDelete,
  colors,
}: Props) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < DELETE_THRESHOLD) {
        translateX.value = withTiming(-500, {
          duration: 250,
        });

        runOnJS(onDelete)(activity.id);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.deleteBackground,
          {
            backgroundColor: colors.danger,
          },
        ]}
      >
        <Ionicons
          name="trash-outline"
          size={26}
          color="#ffffff"
        />

        <Text style={styles.deleteText}>
          Eliminar
        </Text>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            animatedStyle,
          ]}
        >
          <View style={styles.header}>
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: `${colors.primary}20`,
                },
              ]}
            >
              <Ionicons
                name={getActivityIcon(activity.type)}
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={styles.headerText}>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {getActivityName(activity.type)}
              </Text>

              <Text
                style={[
                  styles.date,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {formatDate(activity.startedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.stats}>
            <HistoryStat
              value={activity.distanceKm.toFixed(2)}
              label="km"
              colors={colors}
            />

            <HistoryStat
              value={formatDuration(activity.durationSeconds)}
              label="tiempo"
              colors={colors}
            />

            <HistoryStat
              value={activity.calories.toString()}
              label="kcal"
              colors={colors}
            />
          </View>

          <Text
            style={[
              styles.swipeHint,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Deslizá hacia la izquierda para eliminar
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function HistoryStat({
  value,
  label,
  colors,
}: {
  value: string;
  label: string;
  colors: {
    text: string;
    textSecondary: string;
  };
}) {
  return (
    <View style={styles.stat}>
      <Text
        style={[
          styles.statValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.statLabel,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function getActivityName(type: ActivityType) {
  switch (type) {
    case 'run':
      return 'Carrera';

    case 'bike':
      return 'Bicicleta';

    default:
      return 'Caminata';
  }
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case 'run':
      return 'fitness-outline' as const;

    case 'bike':
      return 'bicycle-outline' as const;

    default:
      return 'walk-outline' as const;
  }
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  wrapper: {
  marginBottom: 14,
  borderRadius: 20,
  overflow: 'hidden',
  position: 'relative',
},

deleteBackground: {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: 120,
  alignItems: 'center',
  justifyContent: 'center',
},

  deleteText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    marginLeft: 13,
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  date: {
    fontSize: 12,
    marginTop: 3,
  },

  stats: {
    flexDirection: 'row',
    marginTop: 20,
  },

  stat: {
    flex: 1,
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },

  swipeHint: {
    fontSize: 10,
    marginTop: 15,
  },
});