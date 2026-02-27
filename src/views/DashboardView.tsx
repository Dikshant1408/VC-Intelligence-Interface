import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Zap,
  ArrowUpRight,
  ChevronRight,
  ListTodo,
  Search
} from 'lucide-react';
import { MOCK_COMPANIES } from '../types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function DashboardView() {
  const lists = JSON.parse(localStorage.getItem('company_lists') || '[]');
  const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]');

  const stats = [
    { label: 'Total Companies', value: MOCK_COMPANIES.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New Signals', value: MOCK_COMPANIES.reduce((acc, c) => acc + c.signals.length, 0), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Lists', value: lists.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Saved Searches', value: savedSearches.length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const recentSignals = MOCK_COMPANIES.flatMap(c => c.signals.map(s => ({ ...s, companyName: c.name, companyId: c.id })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-serif font-bold">Welcome back, Jane</h2>
        <p className="text-gray-500 mt-1">Here's what's happening across your pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-black/5 p-6 rounded-3xl shadow-sm"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold">Recent Market Signals</h3>
            <Link to="/companies" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentSignals.map((signal, idx) => (
              <motion.div 
                key={signal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-black/5 p-5 rounded-2xl flex items-center gap-4 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-gray-400 shrink-0">
                  <Zap size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link to={`/companies/${signal.companyId}`} className="font-bold hover:underline truncate">
                      {signal.companyName}
                    </Link>
                    <span className="text-xs text-gray-400">• {format(new Date(signal.date), 'MMM d')}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{signal.title}</p>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 rounded text-gray-500">
                  {signal.type}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold">Quick Actions</h3>
          <div className="bg-white border border-black/5 p-6 rounded-3xl shadow-sm space-y-3">
            <Link to="/companies" className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Search size={16} />
                </div>
                <span className="text-sm font-medium">Run New Search</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
            </Link>
            <Link to="/lists" className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ListTodo size={16} />
                </div>
                <span className="text-sm font-medium">Manage Lists</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
            </Link>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Pro Tip</p>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Use the "Enrich" button on any company profile to pull real-time signals directly from their website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
