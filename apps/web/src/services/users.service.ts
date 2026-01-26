import apiClient from '@/lib/api-client';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  githubUsername?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  githubUsername?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const usersService = {
  /**
   * Get current user's profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/users/profile');
    return response.data;
  },

  /**
   * Update current user's profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>('/users/profile', data);
    return response.data;
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<UserProfile>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Remove user avatar
   */
  async removeAvatar(): Promise<UserProfile> {
    const response = await apiClient.delete<UserProfile>('/users/avatar');
    return response.data;
  },

  /**
   * Get all users (Admin/Professor only)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const response = await apiClient.get<UserProfile[]>('/users');
    return response.data;
  },

  /**
   * Get user by ID (Admin/Professor only)
   */
  async getUserById(id: string): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(`/users/${id}`);
    return response.data;
  },

  /**
   * Update user by ID (Admin only)
   */
  async updateUser(id: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user by ID (Admin only)
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  /**
   * Create new user (Admin only)
   */
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
    githubUsername?: string;
  }): Promise<UserProfile> {
    const response = await apiClient.post<UserProfile>('/users', data);
    return response.data;
  },
};
