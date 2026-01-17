
import React, { useState } from 'react';
import { Student, Grade } from '../types';
import { Plus, Trash2, GraduationCap, BarChart3, Lock, AlertCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface GradesTrackerProps {
  students: Student[];
  grades: Grade[];
  onAddGrade: (grade: Grade) => void;
  onRemoveGrade: (id: string) => void;
}

const GradesTracker: React.FC<GradesTrackerProps> = ({ students, grades, onAddGrade, onRemoveGrade }) => {
  const [showForm, setShowForm] = useState(false);
  const [newGrade, setNewGrade] = useState<Partial<Grade>>({
    studentId: '',
    subject: 'Teoría del Derecho',
    score: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const distributionData = [
    { range: '0 - 5.9 (Crítico)', count: grades.filter(g => g.score < 6).length, color: '#ef4444' },
    { range: '6.0 - 7.9 (Regular)', count: grades.filter(g => g.score >= 6 && g.score < 8).length, color: '#f59e0b' },
    { range: '8.0 - 10.0 (Excelente)', count: grades.filter(g => g.score >= 8).length, color: '#10b981' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.studentId) return;
    
    onAddGrade({
      ...newGrade as Grade,
      id: Math.random().toString(36).substr(2, 9),
    });
    setShowForm(false);
    setNewGrade({
      studentId: '',
      subject: 'Teoría del Derecho',
      score: 0,
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Libro de Calificaciones</h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Universidad Fray Diego • RVOE</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-8 py-3.5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-200 hover:-translate-y-1 transition-all"
        >
          <Plus size={18} />
          REGISTRAR NOTA
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-red-50 animate-slide-down">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiante</label>
              <select
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 text-slate-900 font-bold appearance-none transition-all"
                value={newGrade.studentId}
                onChange={(e) => setNewGrade({...newGrade, studentId: e.target.value})}
              >
                <option value="" className="text-slate-900">Seleccionar Alumno...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id} className="text-slate-900">{s.name} ({s.career})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asignatura</label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 text-slate-900 font-bold transition-all"
                value={newGrade.subject}
                onChange={(e) => setNewGrade({...newGrade, subject: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calificación (0-10)</label>
              <input
                required
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 text-slate-900 font-bold transition-all"
                value={newGrade.score}
                onChange={(e) => setNewGrade({...newGrade, score: parseFloat(e.target.value)})}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:bg-red-700 transition-all"
              >
                GUARDAR
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
              >
                CANCELAR
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <h4 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-8">
          <BarChart3 size={22} className="text-red-600" /> Rendimiento Global Cuatrimestral
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="range" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: '800' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
              />
              <Bar dataKey="count" radius={[15, 15, 0, 0]} barSize={80}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-8 py-6">Estudiante</th>
                <th className="px-8 py-6">Programa Académico</th>
                <th className="px-8 py-6">Asignatura</th>
                <th className="px-8 py-6">Resultado</th>
                <th className="px-8 py-6">Estatus Financiero</th>
                <th className="px-8 py-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-200">
                      <GraduationCap size={64} strokeWidth={1} />
                      <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Sin registros académicos.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                grades.map((grade) => {
                  const student = students.find(s => s.id === grade.studentId);
                  const isBlocked = student?.financialStatus?.isBlocked;
                  return (
                    <tr key={grade.id} className="hover:bg-red-50/20 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          {isBlocked && <Lock size={14} className="text-red-600" />}
                          <div>
                            <p className="font-bold text-slate-900 leading-none mb-1">{student?.name || '---'}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{student?.group}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[11px] font-bold text-slate-600 uppercase tracking-tight">{student?.career}</td>
                      <td className="px-8 py-5 text-slate-700 font-bold text-xs">{grade.subject}</td>
                      <td className="px-8 py-5">
                        <span className={`px-5 py-2 rounded-full text-xs font-black ${
                          grade.score >= 6 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {grade.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {isBlocked ? (
                          <div className="flex items-center gap-2 text-red-600 animate-pulse">
                            <AlertCircle size={14} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Bloqueo Administrativo</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Estatus Regular</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => onRemoveGrade(grade.id)}
                          className="p-3 text-slate-200 hover:text-red-600 hover:bg-red-50 transition-all rounded-2xl border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradesTracker;
