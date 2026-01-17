
import React from 'react';
import { AppState } from '../types';
import { Download, FileText, Database, RefreshCw, FileCheck } from 'lucide-react';

interface ExportToolProps {
  state: AppState;
  onReset: () => void;
}

const ExportTool: React.FC<ExportToolProps> = ({ state, onReset }) => {
  const downloadCSV = (type: 'students' | 'grades' | 'attendance') => {
    let headers: string[] = [];
    let rows: any[] = [];
    let filename = '';

    if (type === 'students') {
      headers = ['ID', 'Nombre', 'Email', 'Carrera', 'Modalidad', 'Grupo'];
      rows = state.students.map(s => [s.id, s.name, s.email, s.career, s.modality, s.group]);
      filename = 'UFD_Censo_Estudiantil.csv';
    } else if (type === 'grades') {
      headers = ['ID', 'ID Estudiante', 'Asignatura', 'Nota', 'Fecha', 'Descripción'];
      rows = state.grades.map(g => [g.id, g.studentId, g.subject, g.score, g.date, g.description]);
      filename = 'UFD_Libro_Calificaciones.csv';
    } else if (type === 'attendance') {
      headers = ['ID Estudiante', 'Fecha', 'Estado'];
      rows = state.attendance.map(a => [a.studentId, a.date, a.status]);
      filename = 'UFD_Asistencia_Cuatrimestral.csv';
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            id: 'students' as const, 
            title: 'Censo Estudiantil', 
            desc: 'Expediente completo de alumnos inscritos en todas las modalidades.', 
            icon: FileText, 
            color: 'text-red-700', 
            bg: 'bg-red-50' 
          },
          { 
            id: 'grades' as const, 
            title: 'Sábana de Calificaciones', 
            desc: 'Reporte académico consolidado de resultados cuatrimestrales.', 
            icon: FileCheck, 
            color: 'text-[#0f172a]', 
            bg: 'bg-slate-100' 
          },
          { 
            id: 'attendance' as const, 
            title: 'Reporte de Asistencia', 
            desc: 'Consolidado histórico de pases de lista por grupo.', 
            icon: Download, 
            color: 'text-emerald-700', 
            bg: 'bg-emerald-50' 
          },
        ].map((item) => (
          <div key={item.id} className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className={`mx-auto p-6 rounded-[2rem] ${item.bg} ${item.color} mb-10 shadow-lg group-hover:scale-110 transition-transform`}>
              <item.icon size={44} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
            <p className="text-sm text-slate-500 mb-12 flex-1 leading-relaxed font-bold opacity-80">{item.desc}</p>
            <button
              onClick={() => downloadCSV(item.id)}
              className="w-full py-5 bg-[#0f172a] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <Download size={20} />
              EXPORTAR REGISTRO
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-14 opacity-[0.03] pointer-events-none text-red-700 transform rotate-12 scale-150">
           <Database size={200} />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex items-center gap-8">
            <div className="p-8 bg-red-600 text-white rounded-[2.5rem] shadow-2xl shadow-red-900/40">
              <Database size={48} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Mantenimiento de Sistema</h3>
              <p className="text-slate-500 font-bold text-lg opacity-80">Restaura la configuración oficial de la Universidad Fray Diego.</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-12 py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all flex items-center gap-3 shadow-2xl shadow-red-900/40 active:scale-95"
          >
            <RefreshCw size={22} />
            RESTABLECER BASE INSTITUCIONAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportTool;
