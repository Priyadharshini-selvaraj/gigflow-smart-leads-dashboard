import { useState, useEffect, useCallback } from 'react';
import { leadsApi } from '@/api/leads.api';
import { Lead, LeadFilters, PaginationMeta } from '@/types/lead.types';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const effectiveFilters = { ...filters, search: debouncedSearch };
      const result = await leadsApi.getAll(effectiveFilters);
      setLeads(result.data);
      setMeta(result.meta);
    } catch {
      setError('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const updateFilter = <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when filters change (except page itself)
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const deleteLead = async (id: string) => {
    try {
      await leadsApi.delete(id);
      toast.success('Lead deleted successfully');
      void fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const exportCSV = async () => {
    try {
      const blob = await leadsApi.exportCSV({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  return {
    leads,
    meta,
    filters,
    isLoading,
    error,
    updateFilter,
    resetFilters,
    deleteLead,
    exportCSV,
    refetch: fetchLeads,
  };
}
