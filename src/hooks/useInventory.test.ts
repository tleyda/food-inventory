import { renderHook, waitFor } from '@testing-library/react';
import { useInventory } from './useInventory';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

// Mock the db export from ../firebase
vi.mock('../firebase', () => ({
  db: {},
}));

describe('useInventory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should Fetch inventory items and update state', async () => {
    const mockItems = [
      { id: '1', name: 'Apple', quantity: 5, unit: 'pcs' },
      { id: '2', name: 'Milk', quantity: 2, unit: 'L' },
    ];

    (onSnapshot as any).mockImplementation((query: any, callback: any) => {
      callback({
        docs: mockItems.map(item => ({
          id: item.id,
          data: () => ({ name: item.name, quantity: item.quantity, unit: item.unit }),
        })),
      });
      return vi.fn(); // Unsubscribe function
    });

    const { result } = renderHook(() => useInventory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].name).toBe('Apple');
  });

  it('should call addDoc when addItem is called', async () => {
    const newItem = { name: 'Banana', quantity: 3, unit: 'kg', category: 'Fruit' };
    const { result } = renderHook(() => useInventory());

    await result.current.addItem(newItem);

    expect(addDoc).toHaveBeenCalled();
  });

  it('should call updateDoc when updateItem is called', async () => {
    const { result } = renderHook(() => useInventory());

    await result.current.updateItem('1', { quantity: 10 });

    expect(updateDoc).toHaveBeenCalled();
  });

  it('should call deleteDoc when deleteItem is called', async () => {
    const { result } = renderHook(() => useInventory());

    await result.current.deleteItem('1');

    expect(deleteDoc).toHaveBeenCalled();
  });
});
