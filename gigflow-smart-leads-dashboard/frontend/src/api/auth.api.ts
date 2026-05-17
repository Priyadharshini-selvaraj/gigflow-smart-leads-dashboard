import apiClient from './axios';
import { ApiResponse } from '@/types/api.types';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/types/auth.types';

export const authApi = {
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', dto);
    return res.data.data!;
  },

  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', dto);
    return res.data.data!;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data!;
  },
};
