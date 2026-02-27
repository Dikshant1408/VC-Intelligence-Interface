import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ArrowUpDown, 
  MoreHorizontal,
  Plus,
  Save,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MOCK_COMPANIES, Company } from '../types';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export default function CompaniesView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sectorFilter, setSectorFilter] = useState(searchParams.get('sector') || 'All');
  const [stageFilter, setStageFilter] = useState(searchParams.get('stage') || 'All');
  const [sortField, setSortField] = useState<keyof Company>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const pageSize = 5;

  const sectors = ['All', ...new Set(MOCK_COMPANIES.map(c => c.sector))];
  const stages = ['All', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'];

  const filteredCompanies = useMemo(() => {
    return MOCK_COMPANIES.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          company.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = sectorFilter === 'All' || company.sector === sectorFilter;
      const matchesStage = stageFilter === 'All' || company.stage === stageFilter;
      return matchesSearch && matchesSector && matchesStage;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });
  }, [searchQuery, sectorFilter, stageFilter, sortField, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sectorFilter, stageFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCompanies.slice(start, start + pageSize);
  }, [filteredCompanies, currentPage, pageSize]);

  const handleSort = (field: keyof Company) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const saveSearch = () => {
    const saved = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const newSearch = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Search: ${searchQuery || 'All'} (${sectorFilter}/${stageFilter})`,
      query: searchQuery,
      filters: { sector: sectorFilter, stage: stageFilter },
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('saved_searches', JSON.stringify([...saved, newSearch]));
    alert('Search saved!');
  };

  const bulkSaveToList = () => {
    if (selectedCompanyIds.length === 0) return;
    const lists = JSON.parse(localStorage.getItem('company_lists') || '[]');
    if (lists.length === 0) {
      alert('Please create a list first in the Lists view.');
      return;
    }
    const listName = prompt(`Add ${selectedCompanyIds.length} companies to which list? (Enter name)`);
    const targetList = lists.find((l: any) => l.name === listName) || lists[0];
    
    if (targetList) {
      const newIds = selectedCompanyIds.filter(id => !targetList.companyIds.includes(id));
      targetList.companyIds.push(...newIds);
      localStorage.setItem('company_lists', JSON.stringify(lists));
      alert(`Added ${newIds.length} new companies to ${targetList.name}`);
      setSelectedCompanyIds([]);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedCompanyIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAllOnPage = () => {
    const pageIds = paginatedCompanies.map(c => c.id);
    const allSelected = pageIds.every(id => selectedCompanyIds.includes(id));
    if (allSelected) {
      setSelectedCompanyIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedCompanyIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold">Discover</h2>
          <p className="text-gray-500 mt-1">Explore and filter the next generation of startups.</p>
        </div>
        <div className="flex gap-3">
          {selectedCompanyIds.length > 0 && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={bulkSaveToList}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Add {selectedCompanyIds.length} to List
            </motion.button>
          )}
          <button 
            onClick={saveSearch}
            className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-lg hover:bg-black/5 transition-colors text-sm font-medium"
          >
            <Save size={16} />
            Save Search
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-sm font-medium">
            <Plus size={16} />
            Add Company
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>
        <div>
          <select 
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-black/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/5"
          >
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <select 
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-black/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/5"
          >
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5 bg-gray-50/50">
              <th className="px-6 py-4 w-10">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-black focus:ring-black"
                  checked={paginatedCompanies.length > 0 && paginatedCompanies.every(c => selectedCompanyIds.includes(c.id))}
                  onChange={toggleAllOnPage}
                />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-black" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">Company <ArrowUpDown size={12} /></div>
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Funding</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {paginatedCompanies.map((company, idx) => (
              <motion.tr 
                key={company.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-black/[0.02] transition-colors cursor-pointer group"
                onClick={() => navigate(`/companies/${company.id}`)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-black focus:ring-black"
                    checked={selectedCompanyIds.includes(company.id)}
                    onChange={() => toggleSelection(company.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg object-cover border border-black/5" />
                    <div>
                      <div className="font-semibold text-sm">{company.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{company.website}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    {company.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{company.stage}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{company.location}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{company.totalFunding}</div>
                  <div className="text-xs text-gray-400">Last: {company.lastFundingDate}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-black/5"
                    >
                      <ExternalLink size={14} />
                      View Website
                    </a>
                    <button className="p-2 text-gray-400 hover:text-black hover:bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredCompanies.length > 0 && (
          <div className="px-6 py-4 border-t border-black/5 bg-gray-50/30 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, filteredCompanies.length)}</span> of <span className="font-medium">{filteredCompanies.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-black/10 rounded-lg hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={clsx(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                      currentPage === page 
                        ? "bg-black text-white" 
                        : "hover:bg-black/5 text-gray-600"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-black/10 rounded-lg hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {filteredCompanies.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-medium">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
