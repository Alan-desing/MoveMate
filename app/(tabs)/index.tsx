import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

import AnimatedStat from '@/components/AnimatedStat';
import FloatingStartButton from '@/components/FloatingStartButton';
import ActivityTypeModal from '@/components/ActivityTypeModal';

type ActivityType = 'walk' | 'run' | 'bike';

export default function HomeScreen() {
  const { theme } = useAppTheme();

  const colors = Colors[theme];

  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityType | null>(null);

  const handleSelectActivity = (type: ActivityType) => {
    setSelectedActivity(type);
    setActivityModalVisible(false);
  };

  const getActivityName = () => {
    switch (selectedActivity) {
      case 'walk':
        return 'Caminata';

      case 'run':
        return 'Carrera';

      case 'bike':
        return 'Bicicleta';

      default:
        return 'Ninguna actividad seleccionada';
    }
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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Hoy
          </Text>

          <Text style={[styles.title, { color: colors.text }]}>
            Tu movimiento diario
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(150).duration(500)}
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Resumen del día
          </Text>

          <Text
            style={[
              styles.summaryText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Seguí avanzando y completá tu objetivo diario.
          </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progress,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.progressText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            42% del objetivo diario
          </Text>
        </Animated.View>

        <View style={styles.statsRow}>
          <AnimatedStat
            title="Pasos"
            value="4.215"
            delay={200}
            colors={colors}
          />

          <AnimatedStat
            title="Distancia"
            value="3,2"
            unit="km"
            delay={300}
            colors={colors}
          />

          <AnimatedStat
            title="Calorías"
            value="186"
            unit="kcal"
            delay={400}
            colors={colors}
          />
        </View>

        <Animated.View
          entering={FadeInUp.delay(450).duration(500)}
          style={[
            styles.activityCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.activityTitle, { color: colors.text }]}>
            Próxima actividad
          </Text>

          <Text
            style={[
              styles.activityValue,
              {
                color: selectedActivity
                  ? colors.primary
                  : colors.textSecondary,
              },
            ]}
          >
            {getActivityName()}
          </Text>

          <Text
            style={[
              styles.activityDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Tocá el botón + para elegir una actividad y comenzar.
          </Text>
        </Animated.View>
      </ScrollView>

      <FloatingStartButton
        onPress={() => setActivityModalVisible(true)}
      />

      <ActivityTypeModal
        visible={activityModalVisible}
        onClose={() => setActivityModalVisible(false)}
        onSelect={handleSelectActivity}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 120,
  },

  greeting: {
    fontSize: 15,
    marginBottom: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 24,
  },

  summaryCard: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
  },

  summaryTitle: {
    fontSize: 19,
    fontWeight: '700',
  },

  summaryText: {
    marginTop: 6,
    fontSize: 14,
  },

  progressBackground: {
    height: 10,
    marginTop: 18,
    backgroundColor: '#334155',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progress: {
    width: '42%',
    height: '100%',
    borderRadius: 10,
  },

  progressText: {
    marginTop: 8,
    fontSize: 12,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  activityCard: {
    marginTop: 18,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
  },

  activityTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  activityValue: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: '700',
  },

  activityDescription: {
    marginTop: 6,
    fontSize: 13,
  },
});