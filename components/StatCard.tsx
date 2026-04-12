import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string | number;
  unit: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  borderColor?: string;
};

const colorMap: Record<string, string> = {
  blue: '#1446A0',
  orange: '#FF7F11',
  pink: '#DB3069',
  gold: '#F5D547',
  periwinkle: '#ADBDFF',
  green: '#2E8B57',
};

export default function StatCard({ label, value, unit, icon, color = 'blue', borderColor }: Props) {
  const iconColor = colorMap[color] ?? color;

  return (
    <View style={[styles.card, borderColor ? { borderColor: borderColor } : null]}>
      {icon ? (
        <Ionicons name={icon} size={24} color={iconColor} style={styles.icon} />
      ) : null}
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    width: '47%',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  value: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  unit: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
});