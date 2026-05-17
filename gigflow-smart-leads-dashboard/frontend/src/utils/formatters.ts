import { LeadStatus, LeadSource } from '@/types/lead.types';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  Website: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  Instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  Referral: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
};

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];
