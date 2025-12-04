import React from 'react';
import { format } from 'date-fns';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const statusIcons = {
  SCHEDULED: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  IN_PROGRESS: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  COMPLETED: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  CANCELLED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
};

export default function RecentActivity({ workLogs, customers, vehicles }) {
  const getCustomerName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return 'Unknown';
    const customer = customers.find(c => c.id === vehicle.customer_id);
    return customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown';
  };

  const getVehiclePlate = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle?.license_plate || 'N/A';
  };

  return (
    <div className="glass-morphism-card rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {workLogs.slice(0, 5).map((log) => {
          const status = statusIcons[log.status] || statusIcons.SCHEDULED;
          const StatusIcon = status.icon;
          
          return (
            <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl border bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all">
              <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center flex-shrink-0`}>
                <StatusIcon className={`w-5 h-5 ${status.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium mb-1 text-white">{log.work_type}</p>
                <p className="text-sm mb-2 text-slate-400">
                  {getCustomerName(log.customer_vehicle_id)} • {getVehiclePlate(log.customer_vehicle_id)}
                </p>
                <p className="text-xs text-slate-500">
                  {format(new Date(log.scheduled_date), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">€{parseFloat(log.total_price_eur || 0).toFixed(2)}</p>
                <p className={`text-xs ${status.color}`}>{log.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}