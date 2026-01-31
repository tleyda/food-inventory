import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ItemModal } from './ItemModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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
    });

    it('should call onSave with form data when Save is clicked', async () => {
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
                unit: 'pcs'
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
