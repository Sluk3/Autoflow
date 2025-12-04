import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, trend, trendLabel, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism-card rounded-2xl p-6 glass-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
            trend >= 0 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
              : 'bg-red-500/20 text-red-300 border border-red-400/30'
          }`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium mb-2 text-slate-400">{title}</h3>
      <p className="text-3xl font-bold mb-1 text-white">{value}</p>
      {trendLabel && (
        <p className="text-xs text-slate-500">{trendLabel}</p>
      )}
    </motion.div>
  );
}