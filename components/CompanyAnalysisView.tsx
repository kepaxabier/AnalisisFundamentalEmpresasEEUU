import React, { useState } from 'react';
import { Search, FileText, Activity, DollarSign, TrendingUp, AlertCircle, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyzeCompany } from '../services/geminiService';
import { CompanyAnalysis, ReportPeriod } from '../types';

export const CompanyAnalysisView: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [period, setPeriod] = useState<ReportPeriod>(ReportPeriod.QUARTERLY);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompanyAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await analyzeCompany(ticker, period);
      setData(result);
    } catch (err) {
      setError('No se pudo completar el análisis. Verifique el ticker o intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  const MetricCard = ({ label, value, unit, icon: Icon, color = "emerald" }: any) => (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between mb-2">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        {Icon && <Icon size={18} className={`text-${color}-400`} />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">
          {typeof value === 'number' ? formatNumber(value) : value}
        </span>
        {unit && <span className="text-sm text-slate-500 font-medium">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Análisis Fundamental</h2>
        <p className="text-slate-400">Obtenga informes detallados 10-K y 10-Q con análisis de factores internos.</p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Símbolo (ej. AAPL, MSFT, NVDA)"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value={ReportPeriod.QUARTERLY}>Trimestral (10-Q)</option>
          <option value={ReportPeriod.ANNUAL}>Anual (10-K)</option>
        </select>
        <button
          type="submit"
          disabled={loading || !ticker}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>Analizar <FileText size={18} /></>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Summary */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-slate-700 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {data.companyName} <span className="text-emerald-400 text-lg">({data.ticker})</span>
                </h3>
                <span className="text-slate-400 text-sm bg-slate-900 px-2 py-1 rounded mt-2 inline-block">
                  Periodo: {data.period}
                </span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {data.summary}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              label="Ingresos Totales" 
              value={data.internalFactors.income.revenue.value} 
              unit="USD" 
              icon={DollarSign} 
              color="blue"
            />
            <MetricCard 
              label="Beneficio Neto" 
              value={data.internalFactors.income.netIncome.value} 
              unit="USD" 
              icon={Activity} 
              color={data.internalFactors.income.netIncome.value as number > 0 ? "emerald" : "red"}
            />
            <MetricCard 
              label="ROE (Rent. Fin.)" 
              value={data.internalFactors.profitability.roe.value} 
              unit="%" 
              icon={TrendingUp}
              color="purple" 
            />
            <MetricCard 
              label="Crecimiento YoY" 
              value={data.internalFactors.growth.revenueGrowth.value} 
              unit="%" 
              icon={PieChart}
              color={data.internalFactors.growth.revenueGrowth.value as number > 0 ? "emerald" : "red"}
            />
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Profitability & Liquidity */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                Rentabilidad y Solvencia
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Margen Neto</span>
                  <span className="font-semibold text-white">{data.internalFactors.profitability.profitMargin.value}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Margen EBITDA</span>
                  <span className="font-semibold text-white">{data.internalFactors.profitability.ebitdaMargin.value}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Deuda / Capital</span>
                  <span className="font-semibold text-white">{data.internalFactors.solvency.debtToEquity.value}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Flujo Caja Libre</span>
                  <span className="font-semibold text-emerald-400">
                    {formatNumber(data.internalFactors.liquidity.freeCashFlow.value as number)}
                  </span>
                </div>
              </div>
            </div>

            {/* Valuation Ratios */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Valoración
              </h4>
              
              {/* Simple Chart for Valuation */}
              <div className="h-48 mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart 
                    data={[
                      { name: 'PER', value: data.internalFactors.valuation.per.value },
                      { name: 'PSR', value: data.internalFactors.valuation.psr.value },
                      { name: 'EV/EBITDA', value: data.internalFactors.valuation.evEbitda.value }
                    ]}
                    layout="vertical"
                   >
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                     <XAxis type="number" stroke="#94a3b8" hide />
                     <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        cursor={{fill: 'transparent'}}
                     />
                     <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        <Cell fill="#3b82f6" />
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#10b981" />
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                 <div className="p-2 bg-slate-900/50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">PER</div>
                    <div className="font-bold">{data.internalFactors.valuation.per.value}x</div>
                 </div>
                 <div className="p-2 bg-slate-900/50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">PSR</div>
                    <div className="font-bold">{data.internalFactors.valuation.psr.value}x</div>
                 </div>
                 <div className="p-2 bg-slate-900/50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">EV/EBITDA</div>
                    <div className="font-bold">{data.internalFactors.valuation.evEbitda.value}x</div>
                 </div>
              </div>
            </div>

          </div>
          
          {/* Sources Footnote */}
          <div className="text-xs text-slate-600 mt-8 pt-4 border-t border-slate-800">
             Fuentes consultadas: {data.sources.join(', ') || 'Búsqueda web general'}
          </div>
        </div>
      )}
    </div>
  );
};
