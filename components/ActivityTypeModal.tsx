import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ActivityType = 'walk' | 'run' | 'bike';

type ActivityTypeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: ActivityType) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
  };
};

const options = [
  {
    id: 'walk' as ActivityType,
    label: 'Caminata',
    icon: 'walk-outline' as const,
  },
  {
    id: 'run' as ActivityType,
    label: 'Carrera',
    icon: 'fitness-outline' as const,
  },
  {
    id: 'bike' as ActivityType,
    label: 'Bicicleta',
    icon: 'bicycle-outline' as const,
  },
];

export default function ActivityTypeModal({
  visible,
  onClose,
  onSelect,
  colors,
}: ActivityTypeModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modal,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {}}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Nueva actividad
          </Text>

          <Text
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            Elegí el tipo de actividad que querés realizar.
          </Text>

          <View style={styles.options}>
            {options.map((option) => (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.option,
                  {
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => onSelect(option.id)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: `${colors.primary}20`,
                    },
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={28}
                    color={colors.primary}
                  />
                </View>

                <Text style={[styles.optionText, { color: colors.text }]}>
                  {option.label}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            ))}
          </View>

          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={{ color: colors.textSecondary }}>Cancelar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },

  modal: {
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 14,
  },

  options: {
    gap: 12,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },

  cancelButton: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 4,
  },
});