import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadForm } from '@/components/leads/LeadForm';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useLeads } from '@/hooks/useLeads';
import { useAuthStore } from '@/context/authStore';
import { Plus, Download } from 'lucide-react';

const LeadsPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const {
    leads,
    meta,
    filters,
    isLoading,
    updateFilter,
    resetFilters,
    deleteLead,
    exportCSV,
    refetch,
  } = useLeads();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Layout
      title="Leads"
      subtitle={`${meta?.total ?? 0} total leads`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={exportCSV}
          >
            Export CSV
          </Button>
        </div>
        {isAdmin && (
          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateOpen(true)}
          >
            Add Lead
          </Button>
        )}
      </div>

      {/* Filters */}
      <LeadFiltersBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* Table */}
      <LeadTable
        leads={leads}
        isLoading={isLoading}
        meta={meta}
        onPageChange={(page) => updateFilter('page', page)}
        onDelete={deleteLead}
        onRefresh={refetch}
      />

      {/* Create Lead Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Lead"
        size="lg"
      >
        <LeadForm
          onSuccess={() => { setIsCreateOpen(false); void refetch(); }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default LeadsPage;
