import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  color?: string;
};

const tagColors: Record<string, { bg: string; label: string; value: string }> = {
  Category: { bg: '#FFF3E0', label: '#FF7F11', value: '#E56500' },
  Pace:     { bg: '#FCE4EC', label: '#DB3069', value: '#B8254F' },
  Distance: { bg: '#E8EAF6', label: '#1446A0', value: '#0F3380' },
  Duration: { bg: '#FFF8E1', label: '#C6A700', value: '#9E8600' },
};

const defaultColors = { bg: '#EDE7F6', label: '#5B6475', value: '#334155' };

export default function InfoTag({ label, value, color }: Props) {
  const scheme = tagColors[label] || defaultColors;

  const bgColor = color ? `${color}20` : scheme.bg;
  const labelColor = color || scheme.label;
  const valueColor = color ? `${color}DD` : scheme.value;

  return (
    <View style={[styles.tag, { backgroundColor: bgColor }]}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 999,
    flexDirection: 'row',
    marginBottom: 6,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
  },
});