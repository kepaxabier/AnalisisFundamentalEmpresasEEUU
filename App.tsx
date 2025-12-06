import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { CompanyAnalysisView } from './components/CompanyAnalysisView';
import { ScreenerView } from './components/ScreenerView';
import { TrendingUp, BarChart3, Globe, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="text-center md:text-left py-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Bienvenido a FinanzaPro
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl">
                Su plataforma inteligente para el análisis fundamental. Utilice el poder de Gemini para analizar reportes 10-K, 10-Q y detectar las mejores oportunidades de inversión en el mercado de EE.UU.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => setActiveTab('analysis')}
                className="group cursor-pointer bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all hover:-translate-y-1"
              >
                <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Análisis Fundamental</h3>
                <p className="text-slate-400">
                  Desglose detallado de factores internos: Ingresos, Solvencia, Liquidez y Valoración.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('screener')}
                className="group cursor-pointer bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all hover:-translate-y-1"
              >
                <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Earnings Screener</h3>
                <p className="text-slate-400">
                  Ranking de empresas post-Resultados Trimestrales. Encuentre los líderes en crecimiento.
                </p>
              </div>

              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={100} />
                </div>
                <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Datos en Tiempo Real</h3>
                <p className="text-slate-400">
                  Utilizamos la tecnología de <strong>Google Gemini Grounding</strong> para buscar la información financiera más reciente.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mt-12">
               <h3 className="text-xl font-semibold text-white mb-4">¿Cómo funciona la Temporada de Resultados?</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="relative pl-6 border-l-2 border-emerald-500">
                     <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-900 border-2 border-emerald-500 rounded-full"></div>
                     <h4 className="text-white font-medium mb-1">Inicio</h4>
                     <p className="text-sm text-slate-400">Grandes Bancos (JPM, C) reportan 10-15 días tras fin de trimestre.</p>
                  </div>
                  <div className="relative pl-6 border-l-2 border-emerald-500">
                     <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-900 border-2 border-emerald-500 rounded-full"></div>
                     <h4 className="text-white font-medium mb-1">Pico (Avalancha)</h4>
                     <p className="text-sm text-slate-400">Semana 2-4: Tecnológicas (Big Tech), Industriales y Consumo.</p>
                  </div>
                  <div className="relative pl-6 border-l-2 border-emerald-500">
                     <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-900 border-2 border-emerald-500 rounded-full"></div>
                     <h4 className="text-white font-medium mb-1">Cierre</h4>
                     <p className="text-sm text-slate-400">Retailers y empresas con año fiscal diferido cierran el ciclo.</p>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'analysis':
        return <CompanyAnalysisView />;
      case 'screener':
        return <ScreenerView />;
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
