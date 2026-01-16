
import React, { useState } from 'react';
import { AutomationSettings } from '../types';
import { Zap, ExternalLink, Info, Save, CheckCircle2 } from 'lucide-react';

interface AutomationProps {
  settings: AutomationSettings;
  onUpdate: (settings: AutomationSettings) => void;
}

const AutomationSettingsView: React.FC<AutomationProps> = ({ settings, onUpdate }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-red-600 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-red-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="flex-1 relative z-10">
          <h3 className="text-3xl font-black mb-3 flex items-center gap-3">
            <Zap className="fill-current text-white" size={32} />
            Alertas Automáticas
          </h3>
          <p className="text-red-100 font-medium opacity-90 leading-relaxed text-lg">
            Sincroniza el control escolar con tutores. 
            Envía reportes automáticos cuando un alumno supera el umbral de inasistencias.
          </p>
        </div>
        <div className="bg-white/20 p-6 rounded-[2rem] backdrop-blur-xl border border-white/20">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Compatible con</p>
           <img src="https://www.make.com/logo-white.svg" className="h-8" alt="Make Logo" />
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h4 className="text-xl font-black text-slate-800">Canal de Comunicación (Webhook)</h4>
            <p className="text-slate-500 font-medium">Configura el destino de las notificaciones institucionales.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.enabled}
              onChange={(e) => onUpdate({...settings, enabled: e.target.checked})}
            />
            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-7 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Endpoint URL</label>
            <input
              type="url"
              placeholder="https://hook.eu1.make.com/xxxxxxxxxxxx"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 font-mono text-sm transition-all"
              value={settings.webhookUrl}
              onChange={(e) => onUpdate({...settings, webhookUrl: e.target.value})}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tolerancia de Faltas</label>
              <input
                type="number"
                min="1"
                max="20"
                className="w-24 px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-black text-xl"
                value={settings.threshold}
                onChange={(e) => onUpdate({...settings, threshold: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="flex-1">
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                El sistema disparará el evento automáticamente cuando un alumno alcance este número de inasistencias en el cuatrimestre vigente.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showSuccess && (
                <span className="text-emerald-600 text-sm font-black flex items-center gap-2 animate-bounce">
                  <CheckCircle2 size={18} /> CONFIGURACIÓN APLICADA
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${
                showSuccess 
                ? 'bg-emerald-600 text-white' 
                : 'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-1 active:scale-95 shadow-red-200'
              } disabled:opacity-50`}
            >
              {isSaving ? 'GUARDANDO...' : showSuccess ? 'LISTO' : 'GUARDAR AJUSTES'}
            </button>
          </div>
        </div>

        <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] flex gap-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Info size={140} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6">
            <div className="p-4 bg-red-600 rounded-2xl h-fit">
              <Info size={24} />
            </div>
            <div className="text-sm space-y-3">
              <p className="font-black text-red-500 uppercase tracking-widest">Procedimiento de Sincronización:</p>
              <ul className="space-y-2 opacity-80 font-medium">
                <li>• Crea un escenario en <span className="text-red-400 font-bold underline">Make.com</span> usando el módulo Webhooks.</li>
                <li>• Copia y pega la URL en el campo superior de SIAE.</li>
                <li>• El sistema enviará: <code className="bg-white/10 px-1 rounded">studentName</code>, <code className="bg-white/10 px-1 rounded">tutorEmail</code> y <code className="bg-white/10 px-1 rounded">career</code>.</li>
                <li>• Asegúrate de tener activada la casilla superior de "Activado".</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationSettingsView;
