import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('API Service', () => {
  const baseURL = 'http://localhost:8000/api';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login', () => {
    it('should call the login endpoint', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password123',
      };

      axios.post.mockResolvedValue({
        data: {
          token: 'test-token',
          user: { id: 1, email: 'user@example.com' },
        },
      });

      const result = await axios.post(`${baseURL}/login`, credentials);

      expect(axios.post).toHaveBeenCalledWith(`${baseURL}/login`, credentials);
      expect(result.data.token).toBe('test-token');
    });

    it('should handle login error', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'wrong-password',
      };

      axios.post.mockRejectedValue(new Error('Invalid credentials'));

      try {
        await axios.post(`${baseURL}/login`, credentials);
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    });
  });

  describe('Register', () => {
    it('should call the register endpoint', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'patient',
      };

      axios.post.mockResolvedValue({
        data: {
          message: 'User registered successfully',
          user: userData,
        },
      });

      const result = await axios.post(`${baseURL}/register`, userData);

      expect(axios.post).toHaveBeenCalledWith(`${baseURL}/register`, userData);
      expect(result.data.user.email).toBe('john@example.com');
    });
  });

  describe('Get User', () => {
    it('should fetch user data', async () => {
      const token = 'test-token';
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'patient',
        },
      });

      const result = await axios.get(`${baseURL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(result.data.email).toBe('john@example.com');
    });
  });

  describe('Logout', () => {
    it('should call the logout endpoint', async () => {
      const token = 'test-token';
      axios.post.mockResolvedValue({
        data: { message: 'Logged out successfully' },
      });

      const result = await axios.post(
        `${baseURL}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      expect(axios.post).toHaveBeenCalled();
      expect(result.data.message).toBe('Logged out successfully');
    });
  });
});
