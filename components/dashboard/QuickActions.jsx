import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, CarFront, FileText, Phone } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      title: 'New Customer',
      description: 'Add customer',
      icon: UserPlus,
      href: '/customers',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'New Vehicle',
      description: 'Register vehicle',
      icon: CarFront,
      href: '/vehicles',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'New Work Order',
      description: 'Create order',
      icon: FileText,
      href: '/workorders',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Log Call',
      description: 'Record call',
      icon: Phone,
      href: '/calllogs',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          to={action.href}
          className="glass-morphism-card rounded-2xl p-6 glass-hover text-center"
        >
          <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
            <action.icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-semibold mb-1 text-white">{action.title}</h3>
          <p className="text-sm text-slate-400">{action.description}</p>
        </Link>
      ))}
    </div>
  );
}
