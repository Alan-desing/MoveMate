import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type FloatingStartButtonProps = {
  onPress: () => void;
};

export default function FloatingStartButton({
  onPress,
}: FloatingStartButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.85);
        rotation.value = withSpring(45);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        rotation.value = withSpring(0);
      }}
      onPress={onPress}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        <Ionicons name="add" size={34} color="#ffffff" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },

  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,
  },
});