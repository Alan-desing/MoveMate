import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type AnimatedStatProps = {
  title: string;
  value: string;
  unit?: string;
  delay?: number;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    border: string;
  };
};

export default function AnimatedStat({
  title,
  value,
  unit,
  delay = 0,
  colors,
}: AnimatedStatProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
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
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        {title}
      </Text>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>

        {unit ? (
          <Text style={[styles.unit, { color: colors.textSecondary }]}>
            {unit}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },

  title: {
    fontSize: 13,
    marginBottom: 8,
  },

  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },

  value: {
    fontSize: 26,
    fontWeight: '700',
  },

  unit: {
    fontSize: 13,
    marginBottom: 4,
  },
});