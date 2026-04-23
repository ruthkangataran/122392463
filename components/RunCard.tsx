import { Run } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {calculatePace} from "@/lib/utils";
import {useTheme} from "@/context/ThemeContext";

type Props = {
  run: Run;
};

export default function RunCard({ run }: Props) {
    const {theme} = useTheme();
  const router = useRouter();

  const openDetails = () =>
    router.push({
      pathname: '/runs/[id]',
      params: { id: run.id.toString() },
    });

  const pace = calculatePace(run.durationMin, run.distanceKm);

  const runSummary = `${run.distanceKm}km run on ${run.date}`;

  return (
    <Pressable
      accessibilityLabel={`${runSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, borderColor: run.categoryColor },
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View>
        <Text style={[styles.title, { color: theme.text }]}>
          {run.distanceKm} km {run.categoryName}
        </Text>
        <Text style={[styles.date, { color: theme.muted }]}>{run.date}</Text>
      </View>

      <View style={styles.tags}>
        <InfoTag label="time" value={`${run.durationMin} mins`} />
        <InfoTag label="Pace" value={`${pace} min/km`} />
      </View>

      {run.notes ? (
        <Text style={[styles.notes, {color: theme.text}]}>{run.notes}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  notes: {
    color: '#374151',
    fontSize: 14,
    marginTop: 8,
  },
});