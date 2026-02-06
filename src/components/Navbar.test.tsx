import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppNavbar } from './Navbar';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAuth } from '../context/AuthContext';

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AppNavbar', () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the title', () => {
        (useAuth as any).mockReturnValue({
            currentUser: null,
            logout: mockLogout,
        });

        render(<AppNavbar />);
        expect(screen.getByText('Food Inventory')).toBeInTheDocument();
    });

    it('should not render the avatar when no user is logged in', () => {
        (useAuth as any).mockReturnValue({
            currentUser: null,
            logout: mockLogout,
        });

        render(<AppNavbar />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render the avatar when a user is logged in', () => {
        const mockUser = {
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://example.com/photo.jpg',
        };

        (useAuth as any).mockReturnValue({
            currentUser: mockUser,
            logout: mockLogout,
        });

        render(<AppNavbar />);
        
        // HeroUI Avatar renders an img within a button (DropdownTrigger as="button")
        const avatarButton = screen.getByRole('button');
        expect(avatarButton).toBeInTheDocument();
        
        const avatarImage = screen.getByRole('img');
        expect(avatarImage).toHaveAttribute('src', 'https://example.com/photo.jpg');
    });

    it('should show user email and logout button when avatar is clicked', async () => {
        const mockUser = {
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://example.com/photo.jpg',
        };

        (useAuth as any).mockReturnValue({
            currentUser: mockUser,
            logout: mockLogout,
        });

        render(<AppNavbar />);
        
        const avatarButton = screen.getByRole('button');
        fireEvent.click(avatarButton);

        // Wait for dropdown content to appear
        await waitFor(() => {
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
            expect(screen.getByText('Log Out')).toBeInTheDocument();
        });
    });

    it('should call logout when logout button is clicked', async () => {
        const mockUser = {
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://example.com/photo.jpg',
        };

        (useAuth as any).mockReturnValue({
            currentUser: mockUser,
            logout: mockLogout,
        });

        render(<AppNavbar />);
        
        const avatarButton = screen.getByRole('button');
        fireEvent.click(avatarButton);

        await waitFor(() => {
            const logoutButton = screen.getByText('Log Out');
            fireEvent.click(logoutButton);
        });

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});
