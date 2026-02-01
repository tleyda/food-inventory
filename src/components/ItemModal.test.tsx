import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ItemModal } from './ItemModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock useTags hook
vi.mock('../hooks/useTags', () => ({
  useTags: vi.fn(() => ({
    tags: [
      { id: 'tag1', label: 'Urgent', color: '#ff0000' },
      { id: 'tag2', label: 'Low Stock', color: '#ffff00' },
    ],
    loading: false,
  })),
}));

describe('ItemModal', () => {
    const mockOnOpenChange = vi.fn();
    const mockOnSave = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render correctly when open', () => {
        render(
            <ItemModal 
                isOpen={true} 
                onOpenChange={mockOnOpenChange} 
                onSave={mockOnSave} 
            />
        );

        expect(screen.getByText('Add Item')).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Tags/i)[0]).toBeInTheDocument();
    });

    it('should call onSave with form data including tags when Save is clicked', async () => {
        render(
            <ItemModal 
                isOpen={true} 
                onOpenChange={mockOnOpenChange} 
                onSave={mockOnSave} 
            />
        );

        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: 'Test Milk' } });

        const saveButton = screen.getByRole('button', { name: /Save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith({
                name: 'Test Milk',
                quantity: 1,
                category: 'Pantry',
                unit: 'pcs',
                tags: []
            });
        });
    });

    it('should populate fields when editing an existing item', () => {
        const existingItem = {
            id: '1',
            name: 'Existing Apple',
            quantity: 5,
            unit: 'kg',
            category: 'Produce',
            tags: ['tag1'],
            updatedAt: { seconds: 1234, nanoseconds: 0 } as any
        };

        render(
            <ItemModal 
                isOpen={true} 
                onOpenChange={mockOnOpenChange} 
                onSave={mockOnSave} 
                item={existingItem}
            />
        );

        expect(screen.getByText('Edit Item')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Apple')).toBeInTheDocument();
        expect(screen.getByDisplayValue('5')).toBeInTheDocument();
        // The Select component might show the selected tag in a specific way, 
        // but checking if Edit Item is there and name/qty are populated is a good start.
    });

    it('should not call onSave if name is empty', async () => {
        render(
            <ItemModal 
                isOpen={true} 
                onOpenChange={mockOnOpenChange} 
                onSave={mockOnSave} 
            />
        );

        const saveButton = screen.getByRole('button', { name: /Save/i });
        fireEvent.click(saveButton);

        expect(mockOnSave).not.toHaveBeenCalled();
    });
});
