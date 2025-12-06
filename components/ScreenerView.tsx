import React, { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Layers, ListFilter } from 'lucide-react';
import { screenCompanies } from '../services/geminiService';
import { ScreenerResult, ScreenerCriterion } from '../types';

export const ScreenerView: React.FC = () => {
  const [mode, setMode] = useState<'index' | 'custom'>('index');
  const [selectedIndices, setSelectedIndices] = useState<string>('SP500_TOP10');
  const [customTickers, setCustomTickers] = useState('');
  const [criterion, setCriterion] = useState<ScreenerCriterion>(ScreenerCriterion.REVENUE_GROWTH);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreenerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const PREDEFINED_LISTS: Record<string, string[]> = {
    'SP500_TOP10': ['MSFT', 'AAPL', 'NVDA', 'AMZN', 'GOOGL', 'META', 'BRK.B', 'LLY', 'AVGO', 'JPM'],
    'NASDAQ100_TECH': ['AMD', 'INTC', 'QCOM', 'TXN', 'AMAT', 'MU', 'LRCX', 'ADI'],
    'DOW30_FINANCE': ['JPM', 'GS', 'V', 'AXP'],
    'MAGNIFICENT_7': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA']
  };

  const PREDEFINED_LABELS: Record<string, string> = {
    'SP500_TOP10': 'S&P 500 (Top 10 Capitalización)',
    'NASDAQ100_TECH': 'Nasdaq 100 (Semiconductores)',
    'DOW30_FINANCE': 'Dow Jones 30 (Financiero)',
    'MAGNIFICENT_7': 'Las 7 Magníficas'
  };

  const handleRunScreener = async () => {
    let tickersToAnalyze: string[] = [];
    let context = "";

    if (mode === 'index') {
      tickersToAnalyze = PREDEFINED_LISTS[selectedIndices];
      context = PREDEFINED_LABELS[selectedIndices];
    } else {
      tickersToAnalyze = customTickers.split(',').map(t => t.trim().toUpperCase()).filter(t => t.length > 0);
      context = "Lista Personalizada";
      if (tickersToAnalyze.length < 2) {
        setError("Ingrese al menos 2 tickers para comparar.");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await screenCompanies(tickersToAnalyze, criterion, context);
      setResult(data);
    } catch (err) {
      setError('Error al generar el ranking. Intente con menos empresas o verifique los tickers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Screener de Mercado</h2>
        <p className="text-slate-400">
          Compare empresas por crecimiento de Ingresos o BPA (EPS) durante la última temporada de resultados.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ListFilter size={20} className="text-emerald-400"/> Configuración
            </h3>
            
            {/* Mode Selection */}
            <div className="flex bg-slate-900 rounded-lg p-1 mb-6">
              <button
                onClick={() => setMode('index')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === 'index' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Índices / Sectores
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === 'custom' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lista Manual
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {mode === 'index' ? (
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Seleccione Grupo</label>
                  <select
                    value={selectedIndices}
                    onChange={(e) => setSelectedIndices(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.entries(PREDEFINED_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tickers (separados por coma)</label>
                  <textarea
                    value={customTickers}
                    onChange={(e) => setCustomTickers(e.target.value)}
                    placeholder="AAPL, MSFT, TSLA..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-400 mb-2">Criterio de Ranking</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCriterion(ScreenerCriterion.REVENUE_GROWTH)}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                      criterion === ScreenerCriterion.REVENUE_GROWTH
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    Crecimiento Ingresos
                  </button>
                  <button
                    onClick={() => setCriterion(ScreenerCriterion.EPS_GROWTH)}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                      criterion === ScreenerCriterion.EPS_GROWTH
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    Crecimiento BPA
                  </button>
                </div>
              </div>

              <button
                onClick={handleRunScreener}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/20 transition-all mt-4"
              >
                {loading ? 'Analizando...' : 'Generar Ranking'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-800/50 p-12 min-h-[400px]">
              <Layers size={48} className="mb-4 opacity-50" />
              <p>Seleccione un grupo y criterio para ver el ranking.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-emerald-500 bg-slate-800/30 rounded-2xl border border-slate-800/50 p-12 min-h-[400px]">
              <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mb-4" />
              <p className="animate-pulse">Analizando informes trimestrales en tiempo real...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 bg-slate-800">
                   <h3 className="text-xl font-bold text-white">{result.title}</h3>
                   <p className="text-slate-400 text-sm mt-1">{result.analysis}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                        <th className="p-4 font-medium text-center w-16">Rank</th>
                        <th className="p-4 font-medium">Empresa</th>
                        <th className="p-4 font-medium">Periodo</th>
                        <th className="p-4 font-medium text-right">{result.items[0]?.metricLabel}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {result.items.map((item, idx) => (
                        <tr key={item.ticker} className="hover:bg-slate-700/30 transition-colors">
                          <td className="p-4 text-center">
                            {idx === 0 ? (
                              <Trophy size={20} className="text-yellow-400 mx-auto" />
                            ) : (
                              <span className="font-mono text-slate-500">#{item.rank}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{item.ticker}</div>
                            <div className="text-xs text-slate-500">{item.companyName}</div>
                          </td>
                          <td className="p-4 text-slate-300 text-sm">
                            {item.quarter}
                          </td>
                          <td className="p-4 text-right">
                            <div className={`font-bold flex items-center justify-end gap-2 ${item.metricValue > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {item.metricValue > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                              {item.metricValue}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
