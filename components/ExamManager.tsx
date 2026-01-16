
import React, { useState } from 'react';
import { Exam, ExamQuestion } from '../types';
import { Plus, Sparkles, Trash2, FileText, Send, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { generateExamQuestions } from '../services/geminiService';

interface ExamManagerProps {
  exams: Exam[];
  onAddExam: (exam: Exam) => void;
  onRemoveExam: (id: string) => void;
}

const CAREERS = [
  'Derecho', 'Criminología y Criminalística', 'Psicología', 'Administración y Estrategias de Negocios',
  'Ingeniería en Logística Internacional', 'Ingeniería Industrial', 'Pedagogía', 'Ingeniería en Software'
];

const ExamManager: React.FC<ExamManagerProps> = ({ exams, onAddExam, onRemoveExam }) => {
  const [showForm, setShowForm] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    subject: 'Derecho Penal I',
    career: CAREERS[0],
    questions: [] as ExamQuestion[]
  });

  const handleGenerateIA = async () => {
    if (!newExam.subject) return alert("Ingresa una materia primero.");
    setLoadingIA(true);
    const questions = await generateExamQuestions(newExam.subject);
    if (questions.length > 0) {
      setNewExam(prev => ({ ...prev, questions: [...prev.questions, ...questions] }));
    } else {
      alert("No se pudo conectar con el Cerebro Académico.");
    }
    setLoadingIA(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExam.questions.length === 0) return alert("El examen debe tener al menos una pregunta.");
    
    onAddExam({
      ...newExam,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Published',
      createdAt: new Date().toISOString()
    });
    
    setShowForm(false);
    setNewExam({ title: '', subject: 'Derecho Penal I', career: CAREERS[0], questions: [] });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800">Banco de Reactivos</h3>
          <p className="text-slate-500 font-medium">Diseña evaluaciones institucionales alineadas a RVOE.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 shadow-xl shadow-red-100 transition-all font-black"
        >
          <Plus size={20} />
          CREAR EXAMEN
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-red-50 animate-slide-down">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título del Examen</label>
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                  value={newExam.title}
                  placeholder="Ej: Parcial II"
                  onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Materia</label>
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                  value={newExam.subject}
                  onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Carrera</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 appearance-none"
                  value={newExam.career}
                  onChange={(e) => setNewExam({...newExam, career: e.target.value})}
                >
                  {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-black flex items-center gap-2">
                  <BookOpen size={20} className="text-red-500" />
                  Reactivos / Preguntas ({newExam.questions.length})
                </h4>
                <button
                  type="button"
                  disabled={loadingIA}
                  onClick={handleGenerateIA}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all shadow-lg shadow-red-900/40 disabled:opacity-50"
                >
                  {loadingIA ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Magia IA (Generar 5)
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                {newExam.questions.length === 0 ? (
                  <p className="text-center py-10 text-slate-500 italic">No hay preguntas aún. Usa el asistente IA para comenzar.</p>
                ) : (
                  newExam.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white/5 p-4 rounded-xl border border-white/10 group">
                      <div className="flex justify-between gap-4">
                        <span className="text-red-500 font-black">Q{idx+1}</span>
                        <p className="flex-1 text-sm">{q.text}</p>
                        <button onClick={() => setNewExam(prev => ({...prev, questions: prev.questions.filter(qu => qu.id !== q.id)}))} className="text-slate-600 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3 ml-8">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={`text-[10px] p-2 rounded-lg border ${oIdx === q.correctAnswer ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                            {String.fromCharCode(65 + oIdx)}) {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg hover:bg-red-700 flex items-center justify-center gap-2">
                <Send size={18} /> PUBLICAR EXAMEN
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black">
                CANCELAR
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-slate-100">
            <FileText size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aún no se han generado exámenes oficiales.</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                  <FileText size={24} />
                </div>
                <button onClick={() => onRemoveExam(exam.id)} className="p-2 text-slate-300 hover:text-red-600 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{exam.subject}</p>
              <h4 className="text-xl font-black text-slate-800 mb-2">{exam.title}</h4>
              <p className="text-xs text-slate-400 font-bold mb-6">{exam.career}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Publicado</span>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase">{exam.questions.length} Reactivos</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamManager;
