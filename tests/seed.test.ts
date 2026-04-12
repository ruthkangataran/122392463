import { seedDataIfEmpty } from '../db/seed';
import { db } from '../db/client';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seedStudentsIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts students when the table is empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedDataIfEmpty();

    expect(mockDb.insert).toHaveBeenCalledTimes(4);
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Easy' }),
        expect.objectContaining({ name: 'Long' }),
        expect.objectContaining({ name: 'Tempo' }),
        expect.objectContaining({ name: 'Intervals' }),
        expect.objectContaining({ name: 'Race' }),
      ])
    );

  expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ distanceKm: 5, durationMin: 31 }),
        expect.objectContaining({ distanceKm: 8, durationMin: 46 }),
        expect.objectContaining({ distanceKm: 14, durationMin: 85 }),
      ])
    );
  expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ metricType: 'distance', targetValue: 25 }),
        expect.objectContaining({ metricType: 'runs', targetValue: 4 }),
      ])
    );
  });

  it('does nothing when users already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, name: 'Ruth', email: 'ruth@example.com', password: 'test123'},
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedDataIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
