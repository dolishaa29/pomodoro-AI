const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message ?? res.statusText;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return res.json();
}

export function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<User> {
  return request<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function login(data: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getProfile(token: string): Promise<User> {
  return request<User>('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
