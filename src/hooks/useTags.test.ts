import { renderHook, waitFor } from '@testing-library/react';
import { useTags } from './useTags';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { onSnapshot } from 'firebase/firestore';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
}));

// Mock the db export from ../firebase
vi.mock('../firebase', () => ({
  db: {},
}));

describe('useTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should Fetch tags items and update state', async () => {
    const mockTags = [
      { id: '1', label: 'Urgent', color: '#ff0000' },
      { id: '2', label: 'Low Stock', color: '#ffff00' },
    ];

    (onSnapshot as any).mockImplementation((query: any, callback: any) => {
      callback({
        docs: mockTags.map(tag => ({
          id: tag.id,
          data: () => ({ label: tag.label, color: tag.color }),
        })),
      });
      return vi.fn(); // Unsubscribe function
    });

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tags).toHaveLength(2);
    expect(result.current.tags[0].label).toBe('Urgent');
  });
});
