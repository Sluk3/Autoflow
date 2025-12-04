import { useState, useEffect } from 'react'
import { supabase } from '../App'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeVehicles: 0,
    scheduledJobs: 0,
    completedJobs: 0,
    totalRevenue: 0,
    pendingRevenue: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    // TODO: Load stats from Supabase
    // This is a placeholder - you'll need to implement actual queries
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your workshop overview</p>
        </div>
        <div className="glass-morphism-card rounded-xl px-6 py-3">
          <p className="text-sm text-slate-400">Today's Schedule</p>
          <p className="text-2xl font-bold text-white">{stats.scheduledJobs} Jobs</p>
        </div>
      </div>

      <div className="glass-morphism-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-morphism-card rounded-xl p-4">
            <p className="text-slate-400 text-sm">Total Customers</p>
            <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
          </div>
          <div className="glass-morphism-card rounded-xl p-4">
            <p className="text-slate-400 text-sm">Active Vehicles</p>
            <p className="text-2xl font-bold text-white">{stats.activeVehicles}</p>
          </div>
          <div className="glass-morphism-card rounded-xl p-4">
            <p className="text-slate-400 text-sm">Completed Jobs</p>
            <p className="text-2xl font-bold text-white">{stats.completedJobs}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
