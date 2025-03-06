import { toast } from "sonner";

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export const API_ENDPOINT = 'https://udbdh62m4i.execute-api.us-east-1.amazonaws.com';

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Invalid credentials' }));
      throw new Error(errorData.error || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store tokens in sessionStorage
    sessionStorage.setItem('accessToken', data.access_token);
    sessionStorage.setItem('refreshToken', data.refresh_token);
    sessionStorage.setItem('tokenExpiry', (Date.now() + data.expires_in * 1000).toString());

    return true;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getAccessToken = (): string | null => {
  const token = sessionStorage.getItem('accessToken');
  const expiry = sessionStorage.getItem('tokenExpiry');
  
  if (!token || !expiry) {
    return null;
  }

  // Check if token is expired
  if (Date.now() > parseInt(expiry)) {
    return null;
  }

  return token;
};

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

export const logout = (): void => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('tokenExpiry');
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = sessionStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // TODO: Implement refresh token endpoint when available
    // For now, just clear the session and redirect to login
    logout();
    toast.error("Session expired. Please login again.");
    window.location.href = '/';
    return null;
  } catch (error) {
    logout();
    toast.error("Session expired. Please login again.");
    window.location.href = '/';
    return null;
  }
};
