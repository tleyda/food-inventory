import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryList } from './InventoryList';
import { vi, describe, it, expect } from 'vitest';
import type { InventoryItem } from '../types';

describe('InventoryList', () => {
    const mockItems: InventoryItem[] = [
        { id: '1', name: 'Apple', quantity: 10, unit: 'pcs', category: 'Produce', updatedAt: { seconds: 0, nanoseconds: 0 } as any },
        { id: '2', name: 'Milk', quantity: 2, unit: 'L', category: 'Dairy', updatedAt: { seconds: 0, nanoseconds: 0 } as any },
    ];
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it('should render the list of items', () => {
        render(
            <InventoryList 
                items={mockItems} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Milk')).toBeInTheDocument();
        expect(screen.getByText('10 pcs')).toBeInTheDocument();
        expect(screen.getByText('2 L')).toBeInTheDocument();
    });

    it('should call onEdit when edit icon is clicked', () => {
        render(
            <InventoryList 
                items={mockItems} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        const editButton = screen.getByTestId('edit-button-1');
        fireEvent.click(editButton);
        expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should call onDelete when delete icon is clicked', () => {
        render(
            <InventoryList 
                items={mockItems} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        const deleteButton = screen.getByTestId('delete-button-1');
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    it('should show empty content when no items are provided', () => {
        render(
            <InventoryList 
                items={[]} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        expect(screen.getByText('No items found.')).toBeInTheDocument();
    });
});
