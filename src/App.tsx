/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  ListTodo, 
  Search, 
  Bookmark, 
  Settings,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import CompaniesView from './views/CompaniesView';
import CompanyProfileView from './views/CompanyProfileView';
import ListsView from './views/ListsView';
import SavedSearchesView from './views/SavedSearchesView';
import DashboardView from './views/DashboardView';
import { MOCK_COMPANIES } from './types';
import { useNavigate } from 'react-router-dom';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Building2, label: 'Companies', path: '/companies' },
    { icon: ListTodo, label: 'Lists', path: '/lists' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-white border-r border-black/5 transition-all duration-300 z-50",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif text-xl font-bold tracking-tight"
          >
            VC Intelligence
          </motion.h1>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-black/5 rounded">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="px-4 mt-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item",
                isActive ? "sidebar-item-active" : "text-gray-500"
              )}
            >
              <item.icon size={20} />
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-8 left-4 right-4">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-black/5",
          !isOpen && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            JD
          </div>
          {isOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">Jane Doe</p>
              <p className="text-xs text-gray-500 truncate">Principal @ VC</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function Header() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    if (query.length > 1) {
      const filtered = MOCK_COMPANIES.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.sector.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <header className="h-16 border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-xl relative">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search companies, sectors, or lists..." 
            value={search}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setResults([]), 200)}
            className="w-full pl-10 pr-4 py-2 bg-black/5 border-none rounded-full text-sm focus:ring-2 focus:ring-black/5 outline-none"
          />
        </div>
        
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden z-50"
            >
              {results.map(company => (
                <button
                  key={company.id}
                  onClick={() => {
                    navigate(`/companies/${company.id}`);
                    setSearch('');
                    setResults([]);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-black/5 transition-colors text-left"
                >
                  <img src={company.logo} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-bold">{company.name}</p>
                    <p className="text-xs text-gray-500">{company.sector} • {company.stage}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-black/5 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 hover:bg-black/5 rounded-full">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="min-h-screen flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}>
          <Header />
          <div className="p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/companies" element={<CompaniesView />} />
                <Route path="/companies/:id" element={<CompanyProfileView />} />
                <Route path="/lists" element={<ListsView />} />
                <Route path="/saved" element={<SavedSearchesView />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </Router>
  );
}
