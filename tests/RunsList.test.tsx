import React from 'react';
import { render } from '@testing-library/react-native';
import { RunContext } from '../app/_layout';
import RunIndexScreen from '../app/(tabs)/runs';

jest.mock('@/db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

const mockRun = {
  id: 1,
  date: '2026-04-07',
  distanceKm: 5,
  durationMin: 31,
  notes: 'Easy evening run',
  categoryId: 1,
  userId: 1,
  categoryName: 'Easy',
  categoryColor: '#1446A0',
};

describe('RunIndexScreen', () => {
  it('renders seeded run data and the log button', () => {
    const { getByText } = render(
      <RunContext.Provider value={{ runs: [mockRun], setRuns: jest.fn(), reloadRuns: jest.fn() }}>
        <RunIndexScreen />
      </RunContext.Provider>
    );

    expect(getByText('2026-04-07')).toBeTruthy();
    expect(getByText('Log Run')).toBeTruthy();
  });
});
