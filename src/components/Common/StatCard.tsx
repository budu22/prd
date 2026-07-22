import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string | number;
    isUp: boolean;
  };
  color: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'indigo';
}

const colorClasses = {
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  indigo: 'bg-indigo-500',
};

export default function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
              <span>{trend.isUp ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
              <span className="text-slate-400">较昨日</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}