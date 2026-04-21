import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  LayoutDashboard, 
  History, 
  Zap, 
  TrendingUp, 
  Calendar, 
  Globe, 
  Newspaper,
  Loader2,
  ChevronRight,
  Clock,
  Crown,
  Share2,
  Download,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Rundown {
  id: number;
  content: string;
  date: string;
  created_at: string;
}

const App = () => {
  const [rundowns, setRundowns] = useState<Rundown[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchRundowns = async () => {
    try {
      const res = await fetch('/api/rundowns');
      const data = await res.json();
      setRundowns(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching rundowns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRundowns();
  }, []);

  const triggerWorkflow = async () => {
    setTriggering(true);
    try {
      const res = await fetch('/api/trigger-workflow', { method: 'POST' });
      if (res.ok) {
        await fetchRundowns();
      }
    } catch (err) {
      console.error('Error triggering workflow:', err);
    } finally {
      setTriggering(false);
    }
  };

  const selectedRundown = rundowns.find(r => r.id === selectedId) || rundowns[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-amber-100">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown className="w-6 h-6 text-amber-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans premium-gradient selection:bg-amber-500/30">
      {/* Top Bar - Ultra Minimal */}
      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-700 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/20">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                EQUITY<span className="text-amber-500">INSIGHT</span>
                <span className="text-[10px] uppercase tracking-[0.2em] bg-white/10 px-2 py-0.5 rounded text-slate-400 font-medium">Private Terminal</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-slate-500">
              <a href="#" className="hover:text-amber-400 transition-colors">Markets</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Portfolio</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Analysis</a>
            </div>
            <button 
              onClick={triggerWorkflow}
              disabled={triggering}
              className="group relative flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-50 overflow-hidden shadow-xl shadow-white/5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {triggering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
              <span>{triggering ? 'SYNCHRONIZING...' : 'GENERATE BRIEFING'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-10 flex flex-col lg:flex-row gap-10">
        {/* Sidebar: Archive - Styled like a premium list */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-amber-500/80 font-bold text-xs uppercase tracking-[0.2em]">
              <History className="w-4 h-4" />
              <span>Historical Archive</span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">{rundowns.length} EDITIONS</span>
          </div>
          
          <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-4 custom-scrollbar">
            {rundowns.map((rundown) => (
              <button
                key={rundown.id}
                onClick={() => setSelectedId(rundown.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
                  selectedId === rundown.id 
                    ? 'bg-amber-500/5 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                    : 'bg-white/2 border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {selectedId === rundown.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"
                  />
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-mono tracking-widest uppercase ${
                      selectedId === rundown.id ? 'text-amber-500' : 'text-slate-500'
                    }`}>
                      {new Date(rundown.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {selectedId === rundown.id && <Crown className="w-3 h-3 text-amber-500" />}
                  </div>
                  <div className={`font-bold text-sm leading-snug tracking-tight transition-colors ${
                    selectedId === rundown.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {rundown.content.split('\n')[0].replace('# ', '')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content: The Briefing */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {selectedRundown ? (
              <motion.article
                key={selectedRundown.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl shadow-black relative"
              >
                {/* Header Section */}
                <div className="p-12 pb-8 border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                  <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                        Intelligence Report
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>RELEASED {new Date(selectedRundown.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} EST</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-all">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-all">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                    {selectedRundown.content.split('\n')[0].replace('# ', '').split(' - ')[0]}
                    <span className="block text-amber-500 mt-2 text-2xl md:text-3xl font-medium tracking-normal opacity-80 italic font-serif">
                      {selectedRundown.content.split('\n')[0].replace('# ', '').split(' - ')[1]}
                    </span>
                  </h1>
                </div>

                {/* Content Section */}
                <div className="px-12 py-10">
                  <div className="prose prose-invert prose-amber max-w-none 
                    prose-headings:text-white prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-16 prose-h2:mb-8 prose-h2:flex prose-h2:items-center prose-h2:gap-4
                    prose-h2:before:content-[''] prose-h2:before:w-1.5 prose-h2:before:h-8 prose-h2:before:bg-amber-500 prose-h2:before:rounded-full
                    prose-p:text-slate-400 prose-p:text-lg prose-p:leading-relaxed
                    prose-strong:text-amber-200 prose-strong:font-bold
                    prose-ul:space-y-4 prose-li:text-slate-300
                    prose-table:border-collapse prose-table:w-full prose-table:rounded-xl prose-table:overflow-hidden
                    prose-th:bg-white/5 prose-th:text-amber-500 prose-th:text-xs prose-th:uppercase prose-th:tracking-widest prose-th:p-4 prose-th:text-left
                    prose-td:p-4 prose-td:border-b prose-td:border-white/5 prose-td:text-slate-300
                  ">
                    <ReactMarkdown
                      components={{
                        h2: ({children}) => {
                          const text = children?.toString() || '';
                          let icon = <Globe className="w-6 h-6 text-amber-500/60" />;
                          if (text.includes('Macro')) icon = <Globe className="w-6 h-6 text-amber-500/60" />;
                          if (text.includes('Calendar')) icon = <Calendar className="w-6 h-6 text-amber-500/60" />;
                          if (text.includes('Earnings')) icon = <TrendingUp className="w-6 h-6 text-amber-500/60" />;
                          if (text.includes('Movers')) icon = <Zap className="w-6 h-6 text-amber-500/60" />;
                          if (text.includes('Themes')) icon = <LayoutDashboard className="w-6 h-6 text-amber-500/60" />;
                          if (text.includes('News')) icon = <Newspaper className="w-6 h-6 text-amber-500/60" />;
                          if (text.includes('Week')) icon = <Calendar className="w-6 h-6 text-amber-500/60" />;
                          
                          return (
                            <h2 className="group flex items-center gap-4">
                              <span className="p-2 rounded-lg bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors">
                                {icon}
                              </span>
                              <span>{children}</span>
                            </h2>
                          );
                        }
                      }}
                    >
                      {selectedRundown.content.split('\n').slice(1).join('\n')}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Footer Insight */}
                <div className="m-12 mt-0 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-6">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Analyst Perspective</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      This briefing was synthesized from proprietary feeds and institutional data sources. 
                      Market conditions are fluid; trade execution should align with established risk management protocols.
                    </p>
                  </div>
                </div>
              </motion.article>
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <LayoutDashboard className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">No Reports Available</h3>
                <p className="text-slate-500 max-w-xs text-center">Execute the morning workflow to generate your first institutional-grade briefing.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex justify-center gap-12 mb-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           {/* Symbolic Partner Logos Placeholder */}
           <div className="text-xs font-bold tracking-[0.3em] uppercase">Bloomberg</div>
           <div className="text-xs font-bold tracking-[0.3em] uppercase">Reuters</div>
           <div className="text-xs font-bold tracking-[0.3em] uppercase">S&P Global</div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600">
          © 2024 EquityInsight Private Wealth Management. All rights reserved.
        </p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 166, 35, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 166, 35, 0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
