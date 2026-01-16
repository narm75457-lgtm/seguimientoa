
import React from 'react';
import { Subject, AppState } from '../types';
import { BookOpen, BookMarked, Layers, Plus, Trash2 } from 'lucide-react';

interface AcademicProps {
  state: AppState;
}

const AcademicManagement: React.FC<AcademicProps> = ({ state }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Catálogo Académico</h3>
          <p className="text-slate-500 font-medium">Control institucional de programas y asignaturas bajo RVOE.</p>
        </div>
        <button className="px-10 py-4 bg-red-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-200 hover:-translate-y-1 transition-all">
          Añadir Materia
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {['Derecho', 'Psicología', 'Ingeniería en Software y Sistemas'].map(career => (
          <div key={career} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Programa Académico</p>
                <h4 className="text-xl font-black leading-tight">{career}</h4>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl">
                <Layers size={24} />
              </div>
            </div>
            <div className="p-8 space-y-4">
               {state.subjects.filter(s => s.career === career).map(sub => (
                 <div key={sub.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-200 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                          <BookOpen size={18} />
                       </div>
                       <div>
                          <p className="font-black text-slate-800">{sub.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Cuatrimestre: {sub.term} • Créditos: {sub.credits}</p>
                       </div>
                    </div>
                    <button className="text-slate-300 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))}
               {state.subjects.filter(s => s.career === career).length === 0 && (
                 <p className="text-center py-10 text-slate-400 italic text-sm">Sin materias capturadas aún.</p>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicManagement;
