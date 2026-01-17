
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import AttendanceTracker from './components/AttendanceTracker';
import GradesTracker from './components/GradesTracker';
import AIInsights from './components/AIInsights';
import ExportTool from './components/ExportTool';
import TeacherEvaluationView from './components/TeacherEvaluation';
import RiskAnalysis from './components/RiskAnalysis';
import FinanceManagement from './components/FinanceManagement';
import ExamManager from './components/ExamManager';
import StudentPortal from './components/StudentPortal';
import AcademicManagement from './components/AcademicManagement';
import Login from './components/Login';
import { getInitialDB } from './mockData';
import { AppState, UserRole } from './types';
import { supabase } from './lib/supabase';
import { CloudSync, Loader2, Wifi, WifiOff, ShieldCheck, Database } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline'>('online');
  const [state, setState] = useState<AppState>(getInitialDB());

  // Sincronización con Supabase
  const syncToCloud = async (newState: AppState) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('institucional_state')
        .upsert({ id: 1, data: newState, updated_at: new Date().toISOString() });
      
      if (error) throw error;
      setCloudStatus('online');
    } catch (err) {
      console.warn("Cloud sync paused - working in local mode", err);
      setCloudStatus('offline');
    } finally {
      setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('institucional_state')
          .select('data')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;

        if (data && data.data) {
          setState(data.data);
          setCloudStatus('online');
        } else {
          // Si la tabla está vacía, subir el mock inicial
          const initial = getInitialDB();
          setState(initial);
          await syncToCloud(initial);
        }
      } catch (err) {
        console.error("Initial load failed, using local storage backup.");
        setCloudStatus('offline');
        const local = localStorage.getItem('siae_backup');
        if (local) setState(JSON.parse(local));
      } finally {
        setTimeout(() => setIsLoading(false), 1500); // Delay suave para estética
      }
    };
    initData();
  }, []);

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      syncToCloud(next);
      localStorage.setItem('siae_backup', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleLogin = (role: UserRole, studentId?: string) => {
    updateState(prev => ({ ...prev, currentUserRole: role, currentUserId: studentId }));
    setIsLoggedIn(true);
    setActiveTab(role === 'alumno' ? 'student-portal' : 'dashboard');
  };

  const handleLogout = () => setIsLoggedIn(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-10 text-white font-sans">
        <div className="relative mb-10">
          <div className="w-32 h-32 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Database className="text-red-600 animate-pulse" size={40} />
          </div>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-[0.3em] text-center mb-2">SIAE CLOUD</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Universidad Fray Diego • Conectando...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onSelectRole={handleLogin} students={state.students} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={state} />;
      case 'student-portal': return <StudentPortal studentId={state.currentUserId || ''} state={state} />;
      case 'academic-mgmt': return <AcademicManagement state={state} />;
      case 'students': return <StudentList students={state.students} onAddStudent={(s) => updateState(p => ({...p, students: [...p.students, s]}))} onRemoveStudent={(id) => updateState(p => ({...p, students: p.students.filter(s => s.id !== id)}))} />;
      case 'attendance': return <AttendanceTracker students={state.students} records={state.attendance} automation={state.automation} onSaveAttendance={(r) => updateState(p => ({...p, attendance: [...p.attendance, ...r]}))} />;
      case 'exams': return <ExamManager exams={state.exams || []} onAddExam={(e) => updateState(p => ({...p, exams: [e, ...p.exams]}))} onRemoveExam={(id) => updateState(p => ({...p, exams: p.exams.filter(e => e.id !== id)}))} />;
      case 'grades': return <GradesTracker students={state.students} grades={state.grades} onAddGrade={(g) => updateState(p => ({...p, grades: [g, ...p.grades]}))} onRemoveGrade={(id) => updateState(p => ({...p, grades: p.grades.filter(g => g.id !== id)}))} />;
      case 'finances': return <FinanceManagement students={state.students} onUpdateStudent={(s) => updateState(p => ({...p, students: p.students.map(st => st.id === s.id ? s : st)}))} />;
      case 'risk-analysis': return <RiskAnalysis state={state} />;
      case 'ai-insights': return <AIInsights state={state} />;
      case 'teacher-eval': return <TeacherEvaluationView state={state} onAddEvaluation={(e) => updateState(p => ({...p, teacherEvaluations: [...p.teacherEvaluations, e]}))} />;
      case 'export': return <ExportTool state={state} onReset={() => updateState(() => getInitialDB())} />;
      default: return <Dashboard state={state} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={state.currentUserRole} onLogout={handleLogout}>
      {/* Indicador de Status Cloud Premium */}
      <div className="fixed top-8 right-44 z-50 flex items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-500 bg-white shadow-sm ${cloudStatus === 'online' ? 'border-emerald-100 text-emerald-600' : 'border-amber-100 text-amber-600'}`}>
          {cloudStatus === 'online' ? <Wifi size={14} className="animate-pulse" /> : <WifiOff size={14} />}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {cloudStatus === 'online' ? 'Nube Activa' : 'Modo Local'}
          </span>
        </div>
        
        {isSyncing && (
          <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl shadow-lg shadow-red-200 animate-fade-in">
            <CloudSync size={14} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando</span>
          </div>
        )}
      </div>

      {renderContent()}
    </Layout>
  );
};

export default App;
