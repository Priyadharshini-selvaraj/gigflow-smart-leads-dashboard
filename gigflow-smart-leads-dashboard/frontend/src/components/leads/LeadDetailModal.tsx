import React from 'react';
import { Lead } from '@/types/lead.types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/index';
import { STATUS_COLORS, SOURCE_COLORS, formatDateTime } from '@/utils/formatters';
import { Mail, Phone, Building2, Calendar, User, Tag, Globe } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );
};

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isOpen, onClose }) => {
  if (!lead) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="flex items-start gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-lg font-bold text-white">{lead.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{lead.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lead.email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge label={lead.status} className={STATUS_COLORS[lead.status]} />
            <Badge label={lead.source} className={SOURCE_COLORS[lead.source]} />
          </div>
        </div>
      </div>
      <div>
        <DetailRow icon={<Mail size={16} />} label="Email" value={lead.email} />
        <DetailRow icon={<Phone size={16} />} label="Phone" value={lead.phone} />
        <DetailRow icon={<Building2 size={16} />} label="Company" value={lead.company} />
        <DetailRow icon={<Tag size={16} />} label="Status" value={lead.status} />
        <DetailRow icon={<Globe size={16} />} label="Source" value={lead.source} />
        <DetailRow icon={<User size={16} />} label="Assigned To" value={lead.assignedTo?.name} />
        <DetailRow icon={<User size={16} />} label="Created By" value={lead.createdBy?.name} />
        <DetailRow icon={<Calendar size={16} />} label="Created At" value={formatDateTime(lead.createdAt)} />
        <DetailRow icon={<Calendar size={16} />} label="Last Updated" value={formatDateTime(lead.updatedAt)} />
      </div>
      {lead.notes && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-2">Notes</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lead.notes}</p>
        </div>
      )}
    </Modal>
  );
};
