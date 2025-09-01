import api from './api';
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  ChangePasswordData,
  ApiResponse
} from '@/types';

class AuthService {
  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials);
    
    if (response.data.success && response.data.data.token) {
      this.setAuthData(response.data.data.token, response.data.data.user);
    }
    
    return response.data;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success && response.data.data.token) {
      this.setAuthData(response.data.data.token, response.data.data.user);
    }
    
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      this.clearAuthData();
    }
  }

  // Get current user
  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  }

  // Update user profile
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put('/auth/profile', data);
    
    if (response.data.success && response.data.data.user) {
      this.updateStoredUser(response.data.data.user);
    }
    
    return response.data;
  }

  // Change password
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get stored user
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  // Set authentication data
  private setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear authentication data
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Update stored user data
  private updateStoredUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export default new AuthService();