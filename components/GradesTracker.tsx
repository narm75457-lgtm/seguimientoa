
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

  // Cálculo de distribución de calificaciones
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
          <h3 className="text-2xl font-black text-slate-800">Libro de Calificaciones</h3>
          <p className="text-slate-500 font-medium">Gestiona evaluaciones por programa y cuatrimestre.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 shadow-xl shadow-red-100 transition-all font-black"
        >
          <Plus size={20} />
          NUEVA NOTA
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-red-50 animate-slide-down">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estudiante Fray Diego</label>
              <select
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 appearance-none"
                value={newGrade.studentId}
                onChange={(e) => setNewGrade({...newGrade, studentId: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.career})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Materia / Asignatura</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                value={newGrade.subject}
                onChange={(e) => setNewGrade({...newGrade, subject: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Puntaje (0-10)</label>
              <input
                required
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                value={newGrade.score}
                onChange={(e) => setNewGrade({...newGrade, score: parseFloat(e.target.value)})}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-black shadow-lg hover:bg-red-700"
              >
                GUARDAR
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black"
              >
                CERRAR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Visualización de Distribución */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h4 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-8">
          <BarChart3 size={20} className="text-red-600" /> Distribución de Rendimiento Académico
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="range" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: '600' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={60}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-5">Estudiante</th>
                <th className="px-6 py-5">Carrera</th>
                <th className="px-6 py-5">Asignatura</th>
                <th className="px-6 py-5">Resultado</th>
                <th className="px-6 py-5">Estado Pago</th>
                <th className="px-6 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                      <GraduationCap size={48} strokeWidth={1} />
                      <p className="font-bold text-slate-500">Aún no hay calificaciones en el sistema.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                grades.map((grade) => {
                  const student = students.find(s => s.id === grade.studentId);
                  const isBlocked = student?.financialStatus?.isBlocked;
                  return (
                    <tr key={grade.id} className="hover:bg-red-50/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {isBlocked && <Lock size={14} className="text-red-500" />}
                          <div>
                            <p className="font-bold text-slate-800">{student?.name || '---'}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase">{student?.group}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{student?.career}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{grade.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 rounded-2xl text-xs font-black ${
                          grade.score >= 6 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {grade.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isBlocked ? (
                          <div className="flex items-center gap-2 text-red-600 animate-pulse">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">BLOQUEADO</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">LIBERADO</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onRemoveGrade(grade.id)}
                          className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl"
                        >
                          <Trash2 size={16} />
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
