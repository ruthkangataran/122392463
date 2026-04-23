import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Run } from '@/app/_layout';
import {useTheme} from "@/context/ThemeContext";

type Props = {
  runs: Run[];
};

function calculateSteak(runs: Run[]): number {
  if (runs.length === 0) return 0;

  const uniqueDates = [...new Set(runs.map((r) => r.date))].sort().reverse();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);
    const Ms = current.getTime() - next.getTime();
    const Days = Ms / (1000 * 60 * 60 * 24);

    if (Days === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function encouragementMessage(streak: number): string {
    if (streak === 0) return 'Get up loser and go for a run 🙄';
    if (streak < 3) return 'Ok I guess... less of a loser but u can do better 🤔';
    if (streak < 7) return 'Ok kinda slaying but still room for improvement 🥸';
    if (streak < 14) return 'Purr speedy, you are on fire 🔥🏃‍♀️';
    return 'You got this 😛'
}

export default function StreakCard({ runs }: Props) {
  const streak = calculateSteak(runs);
  const message = encouragementMessage(streak);
  const isActive = streak > 0;
  const {theme, isDark} = useTheme();

  return (
    <View style={[
      styles.card,
      { backgroundColor: theme.card, borderColor: theme.border },
      isActive ? { borderColor: '#FF7F11' } : null,
    ]}>
      <View style={styles.row}>
        <View style={[
          styles.iconCircle,
          { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
          isActive ? { backgroundColor: isDark ? '#3B2000' : '#FFF3E0' } : null,
        ]}>
          <Ionicons
            name={isActive ? 'flame' : 'flame-outline'}
            size={24}
            color={isActive ? '#FF7F11' : theme.muted}
          />
        </View>
        <View style={styles.info}>
          <Text style={[styles.streakNumber, { color: theme.text }]}>
            {streak} {'Day Streak'}
          </Text>
          <Text style={[styles.message, { color: theme.muted }]}>{message}</Text>
        </View>
      </View>
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
      marginHorizontal: 10,
  },
  cardActive: {
    borderColor: '#FF7F11',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  iconCircleActive: {
    backgroundColor: '#FFF3E0',
  },
  info: {
    flex: 1,
  },
  streakNumber: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
  },
  message: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
});