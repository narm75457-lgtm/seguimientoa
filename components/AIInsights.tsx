
import React, { useState } from 'react';
import { AppState } from '../types';
import { getClassInsights } from '../services/geminiService';
import { Sparkles, Loader2, BrainCircuit, Send, Info } from 'lucide-react';
import { marked } from 'marked';

interface AIInsightsProps {
  state: AppState;
}

const AIInsights: React.FC<AIInsightsProps> = ({ state }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleGenerate = async (customQuery?: string) => {
    setLoading(true);
    const result = await getClassInsights(state, customQuery);
    setInsights(result || "No se pudo obtener el análisis.");
    setLoading(false);
    if (customQuery) setQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="p-6 rounded-[2rem] bg-red-600 text-white shadow-xl shadow-red-200 flex-shrink-0">
            <BrainCircuit size={48} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Asistente Inteligente Fray Diego</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Consulta planes de estudio (RVOE), requisitos de admisión, modalidades (En línea, Escolarizado, Ejecutivo) 
              o analiza el rendimiento de tus alumnos de forma inteligente.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Pregunta sobre inscripciones, planes de estudio o tus grupos..."
                className="w-full pl-6 pr-14 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 focus:bg-white transition-colors font-medium shadow-inner text-slate-900"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && query && handleGenerate(query)}
              />
              <button
                onClick={() => query && handleGenerate(query)}
                disabled={loading || !query}
                className="absolute right-3 top-3 bottom-3 px-5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-30 transition-all shadow-lg shadow-red-200"
              >
                <Send size={20} />
              </button>
            </div>
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="px-8 py-5 bg-white text-red-600 border-2 border-red-100 rounded-2xl font-black hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <Sparkles size={22} />
              <span className="hidden md:inline">ANÁLISIS GLOBAL</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {[
              '¿Cuáles son las 8 licenciaturas?', 
              'Requisitos para Maestría', 
              'Modalidades disponibles', 
              'Promedio por carrera',
              'Alumnos con más de 3 faltas'
            ].map(tag => (
              <button
                key={tag}
                onClick={() => handleGenerate(tag)}
                className="text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-slate-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-16 rounded-[3rem] border border-slate-100 flex flex-col items-center gap-6 text-red-600 shadow-xl shadow-slate-100 animate-pulse">
          <Loader2 className="animate-spin" size={64} strokeWidth={3} />
          <div className="text-center">
            <p className="font-black uppercase tracking-[0.2em] text-sm">Consultando Cerebro Académico...</p>
            <p className="text-slate-400 text-xs mt-1">Conectando con Universidad Fray Diego</p>
          </div>
        </div>
      )}

      {insights && !loading && (
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl animate-fade-in relative overflow-hidden">
           <div className="absolute top-0 left-0 w-2 h-full bg-red-600" />
           <div className="markdown-content text-slate-700">
             <div 
               dangerouslySetInnerHTML={{ __html: marked.parse(insights) }} 
             />
           </div>
           
           <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full">
               <Info size={16} className="text-red-500" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IA Oficial Fray Diego • RVOE Certificado</p>
             </div>
             <button
               onClick={() => setInsights(null)}
               className="px-6 py-2 text-xs font-black text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors"
             >
               LIMPIAR RESULTADO
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
