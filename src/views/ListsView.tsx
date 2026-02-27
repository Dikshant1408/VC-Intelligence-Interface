import { useState, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  Trash2, 
  Users, 
  Calendar,
  ChevronRight,
  ListTodo,
  Building2,
  ArrowLeft,
  X
} from 'lucide-react';
import { CompanyList, MOCK_COMPANIES } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function ListsView() {
  const [lists, setLists] = useState<CompanyList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('company_lists') || '[]');
    setLists(saved);
  }, []);

  const createList = (nameOverride?: string) => {
    const name = nameOverride || newListName;
    if (!name.trim()) return;
    const newList: CompanyList = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      companyIds: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...lists, newList];
    setLists(updated);
    localStorage.setItem('company_lists', JSON.stringify(updated));
    setNewListName('');
  };

  const deleteList = (id: string) => {
    const updated = lists.filter(l => l.id !== id);
    setLists(updated);
    localStorage.setItem('company_lists', JSON.stringify(updated));
    if (selectedListId === id) setSelectedListId(null);
  };

  const removeFromList = (listId: string, companyId: string) => {
    const updated = lists.map(l => {
      if (l.id === listId) {
        return { ...l, companyIds: l.companyIds.filter(id => id !== companyId) };
      }
      return l;
    });
    setLists(updated);
    localStorage.setItem('company_lists', JSON.stringify(updated));
  };

  const exportList = (list: CompanyList, formatType: 'json' | 'csv') => {
    const companies = MOCK_COMPANIES.filter(c => list.companyIds.includes(c.id));
    let content = '';
    let type = '';
    
    if (formatType === 'json') {
      content = JSON.stringify(companies, null, 2);
      type = 'application/json';
    } else {
      const headers = ['Name', 'Website', 'Sector', 'Stage', 'Location', 'Funding'];
      const rows = companies.map(c => [c.name, c.website, c.sector, c.stage, c.location, c.totalFunding].join(','));
      content = [headers.join(','), ...rows].join('\n');
      type = 'text/csv';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.name.toLowerCase().replace(/\s+/g, '_')}_export.${formatType}`;
    a.click();
  };

  const selectedList = lists.find(l => l.id === selectedListId);
  const listCompanies = selectedList ? MOCK_COMPANIES.filter(c => selectedList.companyIds.includes(c.id)) : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <AnimatePresence mode="wait">
        {!selectedListId ? (
          <motion.div 
            key="list-grid"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif font-bold">My Lists</h2>
                <p className="text-gray-500 mt-1">Organize and track companies across your thesis.</p>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="New list name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="px-4 py-2 bg-white border border-black/10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5"
                />
                <button 
                  onClick={() => createList()}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <Plus size={16} />
                  Create List
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list, idx) => (
                <motion.div 
                  key={list.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => exportList(list, 'csv')}
                        className="p-2 text-gray-400 hover:text-black hover:bg-black/5 rounded-lg" title="Export CSV"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => deleteList(list.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold">{list.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Building2 size={14} /> {list.companyIds.length} companies</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> Created {format(new Date(list.createdAt), 'MMM d')}</span>
                  </div>

                  <div className="mt-6 pt-6 border-t border-black/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {list.companyIds.slice(0, 4).map(id => {
                        const company = MOCK_COMPANIES.find(c => c.id === id);
                        return company ? (
                          <img key={id} src={company.logo} alt={company.name} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                        ) : null;
                      })}
                      {list.companyIds.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          +{list.companyIds.length - 4}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedListId(list.id)}
                      className="text-sm font-medium text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      View List <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}

              {lists.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white border border-dashed border-black/10 rounded-3xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-300 mb-4">
                    <ListTodo size={32} />
                  </div>
                  <h3 className="text-xl font-serif font-bold">No lists yet</h3>
                  <p className="text-gray-500 mt-1 mb-6">Create your first list to start organizing companies.</p>
                  <button 
                    onClick={() => {
                      const name = prompt('Enter list name:');
                      if (name) createList(name);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl hover:bg-black/90 transition-all font-medium"
                  >
                    <Plus size={18} />
                    Create Your First List
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="list-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedListId(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Lists
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => selectedList && exportList(selectedList, 'csv')}
                  className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-lg hover:bg-black/5 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-serif font-bold">{selectedList?.name}</h2>
              <p className="text-gray-500 mt-1">{listCompanies.length} companies in this list.</p>
            </div>

            <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Funding</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {listCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-black/[0.02] transition-colors group cursor-pointer" onClick={() => navigate(`/companies/${company.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg object-cover border border-black/5" />
                          <div>
                            <div className="font-semibold text-sm">{company.name}</div>
                            <div className="text-xs text-gray-500">{company.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                          {company.sector}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{company.stage}</td>
                      <td className="px-6 py-4 text-sm font-medium">{company.totalFunding}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromList(selectedListId!, company.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {listCompanies.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No companies in this list yet.</p>
                  <button 
                    onClick={() => navigate('/companies')}
                    className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Browse companies to add
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
