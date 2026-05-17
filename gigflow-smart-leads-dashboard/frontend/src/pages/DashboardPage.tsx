import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { leadsApi } from '@/api/leads.api';
import { DashboardStats } from '@/types/lead.types';
import { Spinner, Badge } from '@/components/common/index';
import { STATUS_COLORS, SOURCE_COLORS, formatDate } from '@/utils/formatters';
import { useAuthStore } from '@/context/authStore';
import { Users, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = ({ label, value, icon, color, bgColor }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
      <div className={color}>{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    leadsApi.getStats()
      .then(setStats)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout
      title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
      subtitle="Here's an overview of your leads pipeline"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" label="Loading dashboard…" />
        </div>
      ) : stats ? (
        <div className="space-y-6 animate-fade-in">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Total Leads"
              value={stats.total}
              icon={<Users className="w-6 h-6" />}
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-50 dark:bg-blue-900/30"
            />
            <StatCard
              label="Qualified Leads"
              value={stats.byStatus['Qualified'] ?? 0}
              icon={<CheckCircle2 className="w-6 h-6" />}
              color="text-green-600 dark:text-green-400"
              bgColor="bg-green-50 dark:bg-green-900/30"
            />
            <StatCard
              label="In Progress"
              value={(stats.byStatus['New'] ?? 0) + (stats.byStatus['Contacted'] ?? 0)}
              icon={<TrendingUp className="w-6 h-6" />}
              color="text-yellow-600 dark:text-yellow-400"
              bgColor="bg-yellow-50 dark:bg-yellow-900/30"
            />
            <StatCard
              label="Lost Leads"
              value={stats.byStatus['Lost'] ?? 0}
              icon={<XCircle className="w-6 h-6" />}
              color="text-red-600 dark:text-red-400"
              bgColor="bg-red-50 dark:bg-red-900/30"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Status Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By Status</h3>
              <div className="space-y-3">
                {(['New', 'Contacted', 'Qualified', 'Lost'] as const).map((status) => {
                  const count = stats.byStatus[status] ?? 0;
                  const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <Badge label={status} className={STATUS_COLORS[status]} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By Source</h3>
              <div className="space-y-3">
                {(['Website', 'Instagram', 'Referral'] as const).map((source) => {
                  const count = stats.bySource[source] ?? 0;
                  const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={source}>
                      <div className="flex items-center justify-between mb-1">
                        <Badge label={source} className={SOURCE_COLORS[source]} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Leads</h3>
                <Link to="/leads" className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentLeads.slice(0, 5).map((lead) => (
                  <div key={lead._id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{lead.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{lead.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(lead.createdAt)}</p>
                    </div>
                    <Badge label={lead.status} className={`${STATUS_COLORS[lead.status]} text-xs`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Failed to load dashboard stats.</p>
      )}
    </Layout>
  );
};

export default DashboardPage;
