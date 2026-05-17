import React, { useState } from 'react';
import { Lead, PaginationMeta } from '@/types/lead.types';
import { Badge, EmptyState, Spinner, Pagination } from '@/components/common/index';
import { STATUS_COLORS, SOURCE_COLORS, formatDate } from '@/utils/formatters';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { LeadForm } from './LeadForm';
import { LeadDetailModal } from './LeadDetailModal';
import { useAuthStore } from '@/context/authStore';
import { Eye, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, meta, onPageChange, onDelete, onRefresh }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    onDelete(deleteTarget._id);
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-16">
        <Spinner size="lg" label="Loading leads…" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <EmptyState title="No leads found" description="No leads match your current filters. Try adjusting your search or add a new lead." />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Assigned</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {leads.map((lead) => (
                <tr key={lead._id} className={clsx('group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{lead.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[160px]">{lead.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><Badge label={lead.status} className={STATUS_COLORS[lead.status]} /></td>
                  <td className="px-4 py-4"><Badge label={lead.source} className={SOURCE_COLORS[lead.source]} /></td>
                  <td className="px-4 py-4 hidden md:table-cell"><span className="text-gray-600 dark:text-gray-400">{lead.company ?? '—'}</span></td>
                  <td className="px-4 py-4 hidden lg:table-cell"><span className="text-gray-600 dark:text-gray-400">{lead.assignedTo?.name ?? '—'}</span></td>
                  <td className="px-4 py-4 hidden lg:table-cell"><span className="text-gray-500 dark:text-gray-400">{formatDate(lead.createdAt)}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setViewLead(lead)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => setEditLead(lead)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                      {isAdmin && (
                        <button onClick={() => setDeleteTarget(lead)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {meta && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
            <Pagination meta={meta} onPageChange={onPageChange} />
          </div>
        )}
      </div>

      <LeadDetailModal lead={viewLead} isOpen={!!viewLead} onClose={() => setViewLead(null)} />

      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead" size="lg">
        {editLead && <LeadForm lead={editLead} onSuccess={() => { setEditLead(null); onRefresh(); }} onCancel={() => setEditLead(null)} />}
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Lead" size="sm"
        footer={<><Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</Button></>}>
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Delete &quot;{deleteTarget?.name}&quot;?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone. The lead will be permanently removed.</p>
          </div>
        </div>
      </Modal>
    </>
  );
};
