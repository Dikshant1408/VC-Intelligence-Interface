import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Tag, 
  ArrowLeft, 
  Zap, 
  Plus, 
  FileText,
  ExternalLink,
  Clock,
  CheckCircle2,
  Loader2,
  User
} from 'lucide-react';
import { MOCK_COMPANIES, Company, EnrichmentData } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export default function CompanyProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [enrichment, setEnrichment] = useState<EnrichmentData | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    const found = MOCK_COMPANIES.find(c => c.id === id);
    if (found) {
      setCompany(found);
      const cachedEnrichment = localStorage.getItem(`enrichment_${id}`);
      if (cachedEnrichment) setEnrichment(JSON.parse(cachedEnrichment));
      
      const savedNotes = JSON.parse(localStorage.getItem(`notes_${id}`) || '[]');
      setNotes(savedNotes);
    }
  }, [id]);

  const handleEnrich = async () => {
    if (!company) return;
    setIsEnriching(true);
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: company.website, companyName: company.name })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setEnrichment(data);
      localStorage.setItem(`enrichment_${id}`, JSON.stringify(data));
    } catch (error) {
      console.error('Enrichment failed:', error);
      alert('Failed to enrich data. Please try again.');
    } finally {
      setIsEnriching(false);
    }
  };

  const addNote = () => {
    if (!note.trim()) return;
    const newNotes = [note, ...notes];
    setNotes(newNotes);
    localStorage.setItem(`notes_${id}`, JSON.stringify(newNotes));
    setNote('');
  };

  const saveToList = () => {
    const lists = JSON.parse(localStorage.getItem('company_lists') || '[]');
    if (lists.length === 0) {
      alert('Please create a list first in the Lists view.');
      return;
    }
    const listName = prompt('Enter list name to add to (or leave blank for first list):');
    const targetList = listName ? lists.find((l: any) => l.name === listName) : lists[0];
    
    if (targetList) {
      if (!targetList.companyIds.includes(id)) {
        targetList.companyIds.push(id);
        localStorage.setItem('company_lists', JSON.stringify(lists));
        alert(`Added to ${targetList.name}`);
      } else {
        alert('Already in list');
      }
    }
  };

  if (!company) return <div className="p-8 text-center">Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-12"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Discover
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-8">
          {/* Hero Section */}
          <section className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-6">
                <img src={company.logo} alt={company.name} className="w-24 h-24 rounded-2xl object-cover border border-black/5 shadow-sm" />
                <div>
                  <h1 className="text-4xl font-serif font-bold tracking-tight">{company.name}</h1>
                  <p className="text-lg text-gray-500 mt-2 max-w-xl">{company.description}</p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline">
                      <Globe size={16} /> {company.website.replace('https://', '')}
                    </a>
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} /> {company.location}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} /> Founded {company.foundedYear}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                <button 
                  onClick={saveToList}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl hover:bg-black/90 transition-all font-medium flex-1 sm:flex-none"
                >
                  <Plus size={18} /> Save to List
                </button>
                <button 
                  onClick={handleEnrich}
                  disabled={isEnriching}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 border border-black/10 rounded-xl hover:bg-black/5 transition-all font-medium disabled:opacity-50 flex-1 sm:flex-none"
                >
                  {isEnriching ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className="text-amber-500 fill-amber-500" />}
                  {enrichment ? 'Re-enrich' : 'Enrich Profile'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 pt-10 border-t border-black/5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sector</p>
                <p className="mt-1 font-medium">{company.sector}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stage</p>
                <p className="mt-1 font-medium">{company.stage}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Funding</p>
                <p className="mt-1 font-medium">{company.totalFunding}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Funding</p>
                <p className="mt-1 font-medium">{company.lastFundingDate}</p>
              </div>
            </div>
          </section>

          {/* Enrichment Section */}
          {enrichment && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-indigo-100 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="bg-indigo-50/50 px-8 py-4 border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                  <Zap size={18} className="fill-indigo-700" />
                  AI Enrichment
                </div>
                <div className="text-xs text-indigo-500 flex items-center gap-1">
                  <Clock size={14} />
                  Last updated: {format(new Date(enrichment.sources[0].timestamp), 'MMM d, h:mm a')}
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Summary</h3>
                  <p className="text-lg leading-relaxed">{enrichment.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">What they do</h3>
                    <ul className="space-y-2">
                      {enrichment.whatTheyDo.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Derived Signals</h3>
                    <ul className="space-y-2">
                      {enrichment.derivedSignals.map((signal, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <Zap size={16} className="text-amber-500 mt-0.5 shrink-0" />
                          {signal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {enrichment.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</h3>
                  {enrichment.sources.map((source, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-indigo-600 hover:underline">
                      <ExternalLink size={12} />
                      <a href={source.url} target="_blank" rel="noreferrer">{source.url}</a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Signals Timeline */}
          <section className="space-y-6">
            <h3 className="text-xl font-serif font-bold">Signals Timeline</h3>
            <div className="space-y-4 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-0.5 before:bg-black/5">
              {company.signals.map((signal) => (
                <div 
                  key={signal.id} 
                  className={clsx(
                    "bg-white border rounded-2xl p-6 flex gap-6 relative transition-all hover:shadow-md",
                    signal.type === 'funding' ? "border-emerald-100" :
                    signal.type === 'hiring' ? "border-indigo-100" :
                    signal.type === 'product' ? "border-amber-100" : "border-black/5"
                  )}
                >
                  {/* Vertical Accent Line */}
                  <div className={clsx(
                    "absolute left-0 top-6 bottom-6 w-1 rounded-r-full",
                    signal.type === 'funding' ? "bg-emerald-500" :
                    signal.type === 'hiring' ? "bg-indigo-500" :
                    signal.type === 'product' ? "bg-amber-500" : "bg-gray-400"
                  )} />

                  <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm z-10",
                    signal.type === 'funding' ? "bg-emerald-50 text-emerald-600" :
                    signal.type === 'hiring' ? "bg-indigo-50 text-indigo-600" :
                    signal.type === 'product' ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-600"
                  )}>
                    {signal.type === 'funding' ? <DollarSign size={24} /> :
                     signal.type === 'hiring' ? <User size={24} /> :
                     signal.type === 'product' ? <Zap size={24} /> : <FileText size={24} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-lg">{signal.title}</h4>
                          <span className={clsx(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            signal.type === 'funding' ? "bg-emerald-100 text-emerald-700" :
                            signal.type === 'hiring' ? "bg-indigo-100 text-indigo-700" :
                            signal.type === 'product' ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                          )}>
                            {signal.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                          <Clock size={12} />
                          {format(new Date(signal.date), 'MMMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Notes & Tags */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} /> Notes
            </h3>
            <div className="space-y-4">
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a private note..."
                className="w-full p-3 bg-black/5 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/5 min-h-[100px] resize-none"
              />
              <button 
                onClick={addNote}
                className="w-full py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 transition-all"
              >
                Add Note
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {notes.map((n, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 relative group"
                >
                  {n}
                  <div className="text-[10px] text-gray-400 mt-1">Just now</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Tag size={18} /> Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-black/5 text-gray-600 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
              <button className="px-3 py-1 border border-dashed border-black/20 text-gray-400 rounded-full text-xs font-medium hover:border-black/40 hover:text-gray-600">
                + Add Tag
              </button>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
