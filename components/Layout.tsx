import React from 'react';
import { LayoutDashboard, Search, BarChart3, TrendingUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-10 text-emerald-400">
          <TrendingUp size={28} />
          <h1 className="text-xl font-bold tracking-tight text-white">FinanzaPro</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Panel Principal</span>
          </button>

          <button
            onClick={() => onTabChange('analysis')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'analysis' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Search size={20} />
            <span className="font-medium">Análisis Empresa</span>
          </button>

          <button
            onClick={() => onTabChange('screener')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'screener' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Screener & Ranking</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="text-xs text-slate-500">
            Powered by Gemini API
            <br />
            © 2025 FinanzaPro
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-900">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
