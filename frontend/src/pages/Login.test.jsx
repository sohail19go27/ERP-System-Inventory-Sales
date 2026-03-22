import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';
import authService from '../services/auth.service';

// Mock the auth service to prevent actual API calls
vi.mock('../services/auth.service', () => ({
  default: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  }
}));

describe('Login Component', () => {
    
    it('renders the login form elements', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Check if important elements are rendered
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('captures user input and attempts login on submit', async () => {
        const mockLogin = authService.login;
        mockLogin.mockResolvedValueOnce({ data: { token: 'fake-token' } });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Wait for the async login attempt
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1);
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
        });
    });

    it('shows error messages for empty required fields', async () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Submit form without filling it out
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.submit(submitButton.closest('form') || submitButton);

        // Check for Yup validation errors
        await waitFor(() => {
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });
});
