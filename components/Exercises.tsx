// https://api-ninjas.com/api/exercises
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useTheme} from "@/context/ThemeContext";

type Exercise = {
  name: string;
  type: string;
  muscle: string;
  difficulty: string;
  instructions: string;
};

export default function StretchSuggestion() {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();

  const fetchExercise = async () => {
    try {
      setLoading(true);
      setError(false);
      setExpanded(false);


      const res = await fetch('https://api.api-ninjas.com/v1/exercises?type=stretching', {
        headers: {
          'X-Api-Key': process.env.EXPO_PUBLIC_API_KEY ?? '',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      if (data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)];
        setExercise(random);
      }
    } catch (e) {
      console.error('Exercise fetch error:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchExercise();
  }, []);

  if (loading) {
    return (
      <View style={[styles.card, {backgroundColor: theme.card}]}>
        <ActivityIndicator size="small" color="#1446A0" />
        <Text style={styles.loadingText}>Loading stretch...</Text>
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={[styles.card, {backgroundColor: theme.card}]}>
        <Text style={styles.errorText}>Could not load stretch suggestion</Text>
        <Pressable onPress={fetchExercise} style={styles.retryButton}>
          <Text style={styles.retryText}>Tap to retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.card, {backgroundColor: theme.card}]}>
      <View style={styles.header}>
        <Ionicons name="body-outline" size={22} color="#1446A0" />
        <Text style={styles.label}>Pre-run warmup</Text>
        <Pressable onPress={fetchExercise} accessibilityLabel="Get new stretch">
          <Ionicons name="refresh-outline" size={20} color="#94A3B8" />
        </Pressable>
      </View>

      <Text style={styles.name}>{exercise.name}</Text>

      <View style={styles.tags}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{exercise.muscle}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{exercise.difficulty}</Text>
        </View>
      </View>

      <Pressable onPress={() => setExpanded(!expanded)}>
        <Text style={styles.toggleText}>
          {expanded ? 'Hide instructions' : 'Show instructions'}
        </Text>
      </Pressable>

      {expanded ? (
        <Text style={styles.instructions}>{exercise.instructions}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  label: {
    color: '#64748B',
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: '#1446A0',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  toggleText: {
    color: '#1446A0',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },
  instructions: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  retryText: {
    color: '#1446A0',
    fontSize: 13,
    fontWeight: '600',
  },
});