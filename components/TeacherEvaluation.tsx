
import React, { useState } from 'react';
import { Teacher, TeacherEvaluation, AppState } from '../types';
import { Star, MessageSquare, TrendingUp, AlertCircle, Award, ClipboardCheck, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TeacherEvalProps {
  state: AppState;
  onAddEvaluation: (evaluation: TeacherEvaluation) => void;
}

const TeacherEvaluationView: React.FC<TeacherEvalProps> = ({ state, onAddEvaluation }) => {
  const [view, setView] = useState<'admin' | 'form'>('admin');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [scores, setScores] = useState({ clarity: 5, material: 5, punctuality: 5, support: 5 });
  const [comment, setComment] = useState('');

  const teacherStats = state.teachers.map(t => {
    const evals = state.teacherEvaluations.filter(e => e.teacherId === t.id);
    const avg = evals.length > 0 
      ? evals.reduce((acc, e) => acc + (e.scores.clarity + e.scores.material + e.scores.punctuality + e.scores.support) / 4, 0) / evals.length
      : 0;
    return { ...t, avg, count: evals.length };
  }).sort((a, b) => b.avg - a.avg);

  const bestTeacher = teacherStats[0];
  const globalTeacherAvg = teacherStats.length > 0 
    ? (teacherStats.reduce((acc, t) => acc + t.avg, 0) / teacherStats.length).toFixed(1)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    onAddEvaluation({
      id: Math.random().toString(36).substr(2, 9),
      teacherId: selectedTeacher,
      studentId: 'anon-student',
      date: new Date().toISOString().split('T')[0],
      period: 'Cuatrimestre Actual',
      scores,
      comment
    });

    alert('¡Evaluación registrada! Gracias por fortalecer la Universidad Fray Diego.');
    setView('admin');
    setComment('');
    setSelectedTeacher('');
  };

  const renderStars = (rating: number, key: string) => (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => setScores({ ...scores, [key]: star })}
          className={`${star <= (scores as any)[key] ? 'text-red-500 fill-red-500' : 'text-slate-200'} transition-transform hover:scale-125`}
        >
          <Star size={24} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 w-fit shadow-sm">
        <button 
          onClick={() => setView('admin')}
          className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'admin' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Métricas de Calidad
        </button>
        <button 
          onClick={() => setView('form')}
          className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'form' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Nueva Evaluación
        </button>
      </div>

      {view === 'admin' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-red-600 group-hover:scale-110 transition-transform">
                <TrendingUp size={120} />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Satisfacción Global</p>
              <h3 className="text-4xl font-black text-slate-800">{globalTeacherAvg} <span className="text-sm text-slate-300">/ 5</span></h3>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform">
                <Award size={120} />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Docente Destacado</p>
              <h3 className="text-xl font-black text-slate-800 truncate">{bestTeacher?.name || '---'}</h3>
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-1">{bestTeacher?.subject}</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-amber-600 group-hover:scale-110 transition-transform">
                <AlertCircle size={120} />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Reportes Críticos</p>
              <h3 className="text-4xl font-black text-slate-800">
                {teacherStats.filter(t => t.avg > 0 && t.avg < 3).length}
              </h3>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h4 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
               <MessageSquare size={22} className="text-red-600" />
               Opiniones de la Comunidad Universitaria
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {state.teacherEvaluations.slice(-6).reverse().map(e => {
                 const t = state.teachers.find(teacher => teacher.id === e.teacherId);
                 return (
                   <div key={e.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col hover:border-red-200 transition-colors">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                          <User size={16} />
                        </div>
                        <p className="text-[10px] font-black text-slate-700 uppercase">{t?.name}</p>
                      </div>
                      <p className="text-sm text-slate-600 italic flex-1 leading-relaxed">"{e.comment || 'Sin observaciones.'}"</p>
                      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{e.date}</span>
                        <div className="flex gap-0.5">
                          {Array.from({length: 5}).map((_, i) => (
                            <Star key={i} size={10} className={i < (e.scores.clarity + e.scores.material) / 2 ? 'fill-red-500 text-red-500' : 'text-slate-200'} />
                          ))}
                        </div>
                      </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
          <div className="text-center mb-12">
            <div className="bg-red-50 w-20 h-20 rounded-[2rem] flex items-center justify-center text-red-600 mx-auto mb-6 shadow-xl shadow-red-100 border border-red-100">
              <ClipboardCheck size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-800">Evaluación Docente Fray Diego</h3>
            <p className="text-slate-500 font-medium mt-2">Tu feedback es anónimo y vital para la calidad académica con RVOE.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Catedrático a Evaluar</label>
              <select
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 outline-none transition-all appearance-none font-bold text-slate-700"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">Selecciona un profesor...</option>
                {state.teachers.map(t => <option key={t.id} value={t.id}>{t.name} - {t.subject}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {[
                { key: 'clarity', label: 'Claridad Académica' },
                { key: 'material', label: 'Material de Apoyo' },
                { key: 'punctuality', label: 'Puntualidad' },
                { key: 'support', label: 'Tutoría' },
              ].map(item => (
                <div key={item.key} className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{item.label}</label>
                  {renderStars(0, item.key)}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sugerencias o Comentarios</label>
              <textarea
                placeholder="Ayúdanos a mejorar..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 outline-none transition-all min-h-[140px] font-medium"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest"
            >
              ENVIAR EVALUACIÓN
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherEvaluationView;
