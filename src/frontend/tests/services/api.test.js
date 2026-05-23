import { describe, it, expect, vi, beforeEach } from 'vitest';

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
    },
  },
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => apiMock),
  },
}));

describe('API service', () => {
  const storage = new Map();
  const localStorageMock = {
    getItem: vi.fn((key) => storage.get(key) ?? null),
    setItem: vi.fn((key, value) => storage.set(key, String(value))),
    removeItem: vi.fn((key) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
  };

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: localStorageMock,
    });
    vi.clearAllMocks();
    storage.clear();
  });

  it('stores the Sanctum token and user on login', async () => {
    const { login } = await import('../../src/services/api.js');
    apiMock.post.mockResolvedValueOnce({
      data: {
        access_token: 'test-token',
        user: { id: 1, name: 'Patient Demo', role: 'patient' },
      },
    });

    const result = await login('patient@demo.com', 'demo123');

    expect(apiMock.post).toHaveBeenCalledWith('/auth/login', {
      email: 'patient@demo.com',
      password: 'demo123',
    });
    expect(result.access_token).toBe('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(result.user);
  });

  it('uses the current authenticated user endpoint', async () => {
    const { getUser } = await import('../../src/services/api.js');
    apiMock.get.mockResolvedValueOnce({
      data: { id: 1, email: 'patient@demo.com', role: 'patient' },
    });

    const result = await getUser();

    expect(apiMock.get).toHaveBeenCalledWith('/auth/user');
    expect(result.email).toBe('patient@demo.com');
  });

  it('sends booking data to the patient appointment endpoint', async () => {
    const { createAppointment } = await import('../../src/services/api.js');
    const payload = {
      doctor_id: 2,
      date: '2026-05-25',
      time: '10:00',
      type: 'in-person',
      reason: 'Consultation',
    };
    apiMock.post.mockResolvedValueOnce({ data: { id: 10 } });

    const result = await createAppointment(payload);

    expect(apiMock.post).toHaveBeenCalledWith('/patient/appointments', payload);
    expect(result.id).toBe(10);
  });

  it('clears local auth state after logout even if the API call fails', async () => {
    const { logout } = await import('../../src/services/api.js');
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    apiMock.post.mockRejectedValueOnce(new Error('network'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await logout();

    expect(apiMock.post).toHaveBeenCalledWith('/auth/logout');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    consoleSpy.mockRestore();
  });
});
