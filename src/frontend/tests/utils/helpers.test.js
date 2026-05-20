import { describe, it, expect } from 'vitest';

// Utility functions to test
const getInitials = (name = 'User') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

describe('Utility Functions', () => {
  describe('getInitials', () => {
    it('should return initials from a name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should return initials from single name', () => {
      expect(getInitials('Admin')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('U');
    });

    it('should handle multiple names', () => {
      expect(getInitials('Jean Marie Dupont')).toBe('JM');
    });

    it('should default to "User" if not provided', () => {
      expect(getInitials()).toBe('U');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-05-20');
      const formatted = formatDate(date);
      expect(formatted).toContain('mai');
      expect(formatted).toContain('2026');
    });

    it('should handle different dates', () => {
      const date = new Date('2026-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('janvier');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should reject invalid email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('should reject invalid email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('should accept different email formats', () => {
      expect(validateEmail('john.doe@hospital.fr')).toBe(true);
      expect(validateEmail('doctor123@clinic.co.uk')).toBe(true);
    });
  });

  describe('truncateText', () => {
    it('should truncate text exceeding max length', () => {
      const text = 'This is a very long text that needs truncation';
      expect(truncateText(text, 20)).toBe('This is a very long ...');
    });

    it('should not truncate text within max length', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars';
      expect(truncateText(text, 20)).toBe('Exactly twenty chars');
    });
  });
});
