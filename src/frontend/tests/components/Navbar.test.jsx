import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../../src/components/Navbar.jsx';

describe('Navbar Component', () => {
  const mockCallbacks = {
    onLoginClick: vi.fn(),
    onSignUpClick: vi.fn(),
    onLogout: vi.fn(),
    onHomeClick: vi.fn(),
    onDashboardClick: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the navbar logo', () => {
    render(
      <Navbar
        {...mockCallbacks}
        isAuthenticated={false}
        user={null}
      />
    );
    
    expect(screen.getByText('Medbook')).toBeInTheDocument();
  });

  it('should display login and signup buttons when not authenticated', () => {
    render(
      <Navbar
        {...mockCallbacks}
        isAuthenticated={false}
        user={null}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display user menu when authenticated', () => {
    const user = { name: 'John Doe', role: 'patient' };
    render(
      <Navbar
        {...mockCallbacks}
        isAuthenticated={true}
        user={user}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should call onHomeClick when logo is clicked', () => {
    render(
      <Navbar
        {...mockCallbacks}
        isAuthenticated={false}
        user={null}
      />
    );
    
    const logoContainer = screen.getByText('Medbook').closest('.navbar-logo-container');
    fireEvent.click(logoContainer);
    
    expect(mockCallbacks.onHomeClick).toHaveBeenCalled();
  });

  it('should display navigation links', () => {
    render(
      <Navbar
        {...mockCallbacks}
        isAuthenticated={false}
        user={null}
      />
    );
    
    expect(screen.getByText('Fonctionnalités')).toBeInTheDocument();
    expect(screen.getByText('Médecins')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
