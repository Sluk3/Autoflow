
import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Users, Car, Wrench, Euro, Calendar, TrendingUp } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-created_date'),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => base44.entities.CustomerVehicle.list('-created_date'),
  });

  const { data: workLogs = [] } = useQuery({
    queryKey: ['workLogs'],
    queryFn: () => base44.entities.WorkLog.list('-scheduled_date'),
  });

  const { data: webhookStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/58dad8a2-1ae7-4400-8817-bc41270d639e', {
        headers: {
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        }
      });
      const data = await response.json();
      return {
        lifetime: data[0] || {},
        monthly: data[1] || {}
      };
    },
  });

  const stats = webhookStats?.lifetime || {};
  const monthlyStats = webhookStats?.monthly || {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayJobs = workLogs.filter(w => {
    const scheduledDate = new Date(w.scheduled_date);
    scheduledDate.setHours(0, 0, 0, 0);
    return scheduledDate.getTime() === today.getTime();
  });

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your workshop overview</p>
        </div>
        <div className="glass-morphism-card rounded-xl px-6 py-3">
          <p className="text-sm text-slate-400">Today's Schedule</p>
          <p className="text-2xl font-bold text-white">{todayJobs.length} Jobs</p>
        </div>
      </div>

      <QuickActions />

      {statsLoading ? (
        <div className="text-center py-12 text-slate-400">Loading statistics...</div>
      ) : (
        <>
          <div className="glass-morphism-card rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Lifetime Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <StatsCard
                title="Total Customers"
                value={stats.total_customers || '0'}
                icon={Users}
                gradient="from-purple-500 to-pink-500"
              />
              <StatsCard
                title="Active Vehicles"
                value={stats.active_vehicles || '0'}
                icon={Car}
                gradient="from-cyan-500 to-blue-500"
              />
              <StatsCard
                title="Scheduled Jobs"
                value={stats.scheduled_work_logs || '0'}
                icon={Calendar}
                gradient="from-emerald-500 to-teal-500"
              />
              <StatsCard
                title="Completed Jobs"
                value={stats.completed_work_logs || '0'}
                icon={Wrench}
                gradient="from-orange-500 to-red-500"
              />
              <StatsCard
                title="Total Revenue"
                value={`€${parseFloat(stats.total_revenue_eur || 0).toFixed(2)}`}
                icon={Euro}
                gradient="from-green-500 to-emerald-500"
              />
              <StatsCard
                title="Pending Revenue"
                value={`€${parseFloat(stats.pending_revenue_eur || 0).toFixed(2)}`}
                icon={TrendingUp}
                gradient="from-yellow-500 to-orange-500"
              />
            </div>
          </div>

          <div className="glass-morphism-card rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">This Month's Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Jobs"
                value={monthlyStats.total_jobs || '0'}
                icon={Wrench}
                gradient="from-purple-500 to-pink-500"
                trend={monthlyStats.total_jobs_change_pct !== null ? parseFloat(monthlyStats.total_jobs_change_pct || 0) : undefined}
                trendLabel={monthlyStats.total_jobs_change_pct !== null ? "vs last month" : undefined}
              />
              <StatsCard
                title="Completed Jobs"
                value={monthlyStats.completed_jobs || '0'}
                icon={Calendar}
                gradient="from-cyan-500 to-blue-500"
                trend={monthlyStats.completed_jobs_change_pct !== null ? parseFloat(monthlyStats.completed_jobs_change_pct || 0) : undefined}
                trendLabel={monthlyStats.completed_jobs_change_pct !== null ? "vs last month" : undefined}
              />
              <StatsCard
                title="Total Revenue"
                value={`€${parseFloat(monthlyStats.total_revenue || 0).toFixed(2)}`}
                icon={Euro}
                gradient="from-emerald-500 to-teal-500"
                trend={monthlyStats.total_revenue_change_pct !== null ? parseFloat(monthlyStats.total_revenue_change_pct || 0) : undefined}
                trendLabel={monthlyStats.total_revenue_change_pct !== null ? "vs last month" : undefined}
              />
              <StatsCard
                title="Paid Revenue"
                value={`€${parseFloat(monthlyStats.paid_revenue || 0).toFixed(2)}`}
                icon={TrendingUp}
                gradient="from-green-500 to-emerald-500"
                trend={monthlyStats.paid_revenue_change_pct !== null ? parseFloat(monthlyStats.paid_revenue_change_pct || 0) : undefined}
                trendLabel={monthlyStats.paid_revenue_change_pct !== null ? "vs last month" : undefined}
              />
            </div>
          </div>
        </>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivity 
          workLogs={workLogs} 
          customers={customers}
          vehicles={vehicles}
        />
        
        <div className="glass-morphism-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Upcoming ITV Inspections</h2>
          <div className="space-y-4">
            {vehicles
              .filter(v => v.itv_inspection && new Date(v.itv_inspection) > new Date())
              .sort((a, b) => new Date(a.itv_inspection) - new Date(b.itv_inspection))
              .slice(0, 5)
              .map((vehicle) => {
                const customer = customers.find(c => c.id === vehicle.customer_id);
                const daysUntil = Math.ceil((new Date(vehicle.itv_inspection) - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 rounded-xl border bg-slate-800/50 border-slate-700">
                    <div>
                      <p className="font-medium text-white">{vehicle.license_plate}</p>
                      <p className="text-sm text-slate-400">
                        {customer?.first_name} {customer?.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{daysUntil} days</p>
                      <p className="text-xs text-slate-500">
                        {new Date(vehicle.itv_inspection).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            {vehicles.filter(v => v.itv_inspection && new Date(v.itv_inspection) > new Date()).length === 0 && (
              <p className="text-center py-8 text-slate-500">No upcoming inspections</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
