import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  compact?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

export default function PrimaryButton({
  label,
  onPress,
  compact = false,
  variant = 'primary',
}: Props) {
  const colourScheme = useColorScheme();
  const theme = colourScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary },

        variant === 'secondary' && {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
        },

        variant === 'danger' && {
          backgroundColor: colourScheme === 'dark' ? '#3A1D1D' : '#FEF2F2',
          borderColor: theme.danger,
          borderWidth: 1,
        },

        compact && styles.compact,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: '#FFFFFF' },
          variant === 'secondary' && { color: theme.text },
          variant === 'danger' && { color: theme.danger },
          compact && styles.compactLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  compact: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  compactLabel: {
    fontSize: 13,
  },
});