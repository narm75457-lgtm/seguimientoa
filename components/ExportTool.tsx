
import React from 'react';
import { AppState } from '../types';
import { Download, FileText, Table, Database, RefreshCw, FileCheck } from 'lucide-react';

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
      filename = 'alumnos_fray_diego.csv';
    } else if (type === 'grades') {
      headers = ['ID', 'ID Estudiante', 'Asignatura', 'Nota', 'Fecha', 'Descripción'];
      rows = state.grades.map(g => [g.id, g.studentId, g.subject, g.score, g.date, g.description]);
      filename = 'calificaciones_globales.csv';
    } else if (type === 'attendance') {
      headers = ['ID Estudiante', 'Fecha', 'Estado'];
      rows = state.attendance.map(a => [a.studentId, a.date, a.status]);
      filename = 'asistencia_cuatrimestral.csv';
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
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            id: 'students' as const, 
            title: 'Base Alumnos', 
            desc: 'Padrón completo de perfiles por carrera y modalidad.', 
            icon: FileText, 
            color: 'text-red-600', 
            bg: 'bg-red-50' 
          },
          { 
            id: 'grades' as const, 
            title: 'Sabana Notas', 
            desc: 'Reporte académico acumulado del cuatrimestre.', 
            icon: FileCheck, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50' 
          },
          { 
            id: 'attendance' as const, 
            title: 'Pase Lista', 
            desc: 'Consolidado de asistencia y retardos históricos.', 
            icon: Download, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
          },
        ].map((item) => (
          <div key={item.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className={`mx-auto p-5 rounded-[2rem] ${item.bg} ${item.color} mb-8 border border-current opacity-80`}>
              <item.icon size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3">{item.title}</h3>
            <p className="text-sm text-slate-500 mb-10 flex-1 leading-relaxed font-medium">{item.desc}</p>
            <button
              onClick={() => downloadCSV(item.id)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors flex items-center justify-center gap-3"
            >
              <Download size={18} />
              EXPORTAR CSV
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-red-600">
           <Database size={160} />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 shadow-xl shadow-red-50">
              <Database size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">Mantenimiento Global</h3>
              <p className="text-slate-500 font-medium">Restaura la información oficial de prueba para demostraciones o auditoría.</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all flex items-center gap-3 shadow-2xl shadow-red-200 active:scale-95"
          >
            <RefreshCw size={20} />
            RESTAURAR DEMO FRAY DIEGO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportTool;
