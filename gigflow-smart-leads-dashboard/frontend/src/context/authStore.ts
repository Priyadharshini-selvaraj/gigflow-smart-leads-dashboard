import { create } from 'zustand';
import { User, LoginDto, RegisterDto } from '@/types/auth.types';
import { authApi } from '@/api/auth.api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('gigflow_token'),
  isAuthenticated: !!localStorage.getItem('gigflow_token'),
  isLoading: false,

  login: async (dto: LoginDto) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authApi.login(dto);
      localStorage.setItem('gigflow_token', token);
      localStorage.setItem('gigflow_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (dto: RegisterDto) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authApi.register(dto);
      localStorage.setItem('gigflow_token', token);
      localStorage.setItem('gigflow_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('gigflow_token');
    localStorage.removeItem('gigflow_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: async () => {
    const token = localStorage.getItem('gigflow_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const user = await authApi.getMe();
      set({ user, token, isAuthenticated: true });
    } catch {
      localStorage.removeItem('gigflow_token');
      localStorage.removeItem('gigflow_user');
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
