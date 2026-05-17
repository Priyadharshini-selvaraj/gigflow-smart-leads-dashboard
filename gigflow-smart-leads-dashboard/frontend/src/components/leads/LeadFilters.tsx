import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '@/types/lead.types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/utils/formatters';
import { Input, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
}

export const LeadFiltersBar: React.FC<LeadFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const hasActiveFilters =
    filters.status || filters.source || filters.search || filters.sort !== 'latest';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
        {hasActiveFilters && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-medium">
            Active
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-1">
          <Input
            placeholder="Search name or email…"
            value={filters.search ?? ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              filters.search ? (
                <button onClick={() => onFilterChange('search', '')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null
            }
          />
        </div>
        <Select
          placeholder="All Statuses"
          value={filters.status ?? ''}
          onChange={(e) => onFilterChange('status', e.target.value as LeadStatus | '')}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <Select
          placeholder="All Sources"
          value={filters.source ?? ''}
          onChange={(e) => onFilterChange('source', e.target.value as LeadSource | '')}
          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
        />
        <div className="flex gap-2">
          <Select
            value={filters.sort ?? 'latest'}
            onChange={(e) => onFilterChange('sort', e.target.value as SortOrder)}
            options={[
              { value: 'latest', label: 'Latest First' },
              { value: 'oldest', label: 'Oldest First' },
            ]}
          />
          {hasActiveFilters && (
            <Button variant="ghost" size="md" onClick={onReset} className="flex-shrink-0">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
