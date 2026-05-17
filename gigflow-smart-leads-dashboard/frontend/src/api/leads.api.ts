import apiClient from './axios';
import { ApiResponse } from '@/types/api.types';
import {
  Lead,
  CreateLeadDto,
  UpdateLeadDto,
  LeadFilters,
  PaginatedResponse,
  DashboardStats,
} from '@/types/lead.types';

export const leadsApi = {
  getAll: async (filters: LeadFilters): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());

    const res = await apiClient.get<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
    return res.data;
  },

  getOne: async (id: string): Promise<Lead> => {
    const res = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data.data!;
  },

  create: async (dto: CreateLeadDto): Promise<Lead> => {
    const res = await apiClient.post<ApiResponse<Lead>>('/leads', dto);
    return res.data.data!;
  },

  update: async (id: string, dto: UpdateLeadDto): Promise<Lead> => {
    const res = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}`, dto);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  exportCSV: async (filters: Omit<LeadFilters, 'page' | 'limit' | 'sort'>): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);

    const res = await apiClient.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return res.data as Blob;
  },

  getStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/leads/stats');
    return res.data.data!;
  },
};
