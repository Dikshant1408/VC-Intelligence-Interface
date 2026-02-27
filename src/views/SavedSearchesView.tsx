import { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Play, 
  Trash2, 
  Filter,
  Bookmark
} from 'lucide-react';
import { SavedSearch } from '../types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function SavedSearchesView() {
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    setSearches(saved);
  }, []);

  const deleteSearch = (id: string) => {
    const updated = searches.filter(s => s.id !== id);
    setSearches(updated);
    localStorage.setItem('saved_searches', JSON.stringify(updated));
  };

  const runSearch = (search: SavedSearch) => {
    navigate(`/companies?q=${encodeURIComponent(search.query)}&sector=${search.filters.sector}&stage=${search.filters.stage}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-serif font-bold">Saved Searches</h2>
        <p className="text-gray-500 mt-1">Quickly access your most frequent discovery workflows.</p>
      </div>

      <div className="space-y-4">
        {searches.map((search, idx) => (
          <motion.div 
            key={search.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-black/5 rounded-2xl p-6 flex items-center justify-between hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-gray-400">
                <Search size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{search.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={14} /> Saved {format(new Date(search.createdAt), 'MMM d, yyyy')}</span>
                  <span className="flex items-center gap-1"><Filter size={14} /> {search.filters.sector} • {search.filters.stage}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => deleteSearch(search.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={() => runSearch(search)}
                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl hover:bg-black/90 transition-all font-medium"
              >
                <Play size={16} fill="white" />
                Run Search
              </button>
            </div>
          </motion.div>
        ))}

        {searches.length === 0 && (
          <div className="py-20 text-center bg-white border border-dashed border-black/10 rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-300 mb-4">
              <Bookmark size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold">No saved searches</h3>
            <p className="text-gray-500 mt-1">Save your filters on the Discover page to see them here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
