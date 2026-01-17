
import React, { useState } from 'react';
import { AppState, Student } from '../types';
import { analyzeDropoutRisk } from '../services/geminiService';
import { AlertTriangle, Brain, Loader2, MessageCircle, TrendingDown, Clock, Heart, ShieldAlert } from 'lucide-react';
import { marked } from 'marked';

interface RiskAnalysisProps {
  state: AppState;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ state }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Lógica de cálculo de riesgo para filtrado inicial
  const studentsWithRisk = state.students.map(student => {
    const studentGrades = state.grades.filter(g => g.studentId === student.id);
    const avgGrade = studentGrades.length > 0 
      ? studentGrades.reduce((acc, g) => acc + g.score, 0) / studentGrades.length 
      : 10;
    
    const studentAttendance = state.attendance.filter(a => a.studentId === student.id);
    const attendanceRate = studentAttendance.length > 0
      ? (studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100
      : 100;

    const wellbeingAlert = student.profile?.wellbeing === 'Alerta (Carga Alta)';
    
    // Umbrales de riesgo
    let riskLevel: 'Crítico' | 'Alto' | 'Medio' | 'Bajo' = 'Bajo';
    if (avgGrade < 6 || attendanceRate < 60 || wellbeingAlert) riskLevel = 'Crítico';
    else if (avgGrade < 7.5 || attendanceRate < 80) riskLevel = 'Alto';
    else if (avgGrade < 8.5) riskLevel = 'Medio';

    return { student, avgGrade, attendanceRate, riskLevel, wellbeingAlert };
  }).sort((a, b) => {
    const weights = { Crítico: 3, Alto: 2, Medio: 1, Bajo: 0 };
    return weights[b.riskLevel] - weights[a.riskLevel];
  });

  const handleAnalyze = async (data: typeof studentsWithRisk[0]) => {
    setSelectedStudentId(data.student.id);
    setLoading(true);
    const result = await analyzeDropoutRisk(data.student, data.avgGrade, data.attendanceRate);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-red-100 shadow-sm flex items-center gap-6">
        <div className="p-4 bg-red-600 text-white rounded-2xl animate-pulse">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800">Detección de Riesgo de Deserción</h3>
          <p className="text-slate-500 font-medium">Análisis predictivo basado en rendimiento académico, asistencia y perfil psicopedagógico.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* List of at-risk students */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Estudiantes Identificados</h4>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {studentsWithRisk.map((item) => (
              <div 
                key={item.student.id}
                className={`p-6 rounded-[2rem] bg-white border-2 transition-all cursor-pointer ${
                  selectedStudentId === item.student.id ? 'border-red-600 shadow-xl' : 'border-transparent shadow-sm hover:border-slate-200'
                }`}
                onClick={() => handleAnalyze(item)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white ${
                      item.riskLevel === 'Crítico' ? 'bg-red-600' : item.riskLevel === 'Alto' ? 'bg-orange-500' : 'bg-amber-500'
                    }`}>
                      {item.student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.student.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.student.career}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.riskLevel === 'Crítico' ? 'bg-red-100 text-red-600 animate-pulse' : 
                    item.riskLevel === 'Alto' ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    Riesgo {item.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <TrendingDown size={14} className={item.avgGrade < 7 ? 'text-red-500' : 'text-slate-400'} />
                    <span className="text-xs font-bold">{item.avgGrade.toFixed(1)} Prom.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} className={item.attendanceRate < 80 ? 'text-red-500' : 'text-slate-400'} />
                    <span className="text-xs font-bold">{item.attendanceRate.toFixed(0)}% Asist.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Heart size={14} className={item.wellbeingAlert ? 'text-red-500' : 'text-slate-400'} />
                    <span className="text-xs font-bold">{item.student.profile?.wellbeing || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="sticky top-0">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden h-[600px] flex flex-col">
            <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="text-red-500" />
                <h4 className="font-black text-lg uppercase tracking-tight">Análisis de Retención IA</h4>
              </div>
              {loading && <Loader2 className="animate-spin text-red-500" size={24} />}
            </div>

            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
              {!selectedStudentId ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <ShieldAlert size={64} />
                  <p className="font-bold max-w-xs uppercase tracking-widest text-xs">Selecciona un estudiante para que la IA realice un diagnóstico profundo</p>
                </div>
              ) : loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Analizando patrones de deserción...</p>
                </div>
              ) : (
                <div className="animate-fade-in space-y-6">
                  <div className="markdown-content text-slate-700">
                    <div 
                      dangerouslySetInnerHTML={{ __html: marked.parse(analysis || '') }} 
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200">
                    <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all">
                      <MessageCircle size={18} /> Contactar Tutor / Alumno
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
