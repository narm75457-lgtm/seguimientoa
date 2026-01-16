
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import AttendanceTracker from './components/AttendanceTracker';
import GradesTracker from './components/GradesTracker';
import AIInsights from './components/AIInsights';
import ExportTool from './components/ExportTool';
import AutomationSettingsView from './components/AutomationSettings';
import TeacherEvaluationView from './components/TeacherEvaluation';
import InitialAssessment from './components/InitialAssessment';
import RiskAnalysis from './components/RiskAnalysis';
import FinanceManagement from './components/FinanceManagement';
import ExamManager from './components/ExamManager';
import StudentPortal from './components/StudentPortal';
import AcademicManagement from './components/AcademicManagement';
import Login from './components/Login';
import { getInitialDB } from './mockData';
import { AppState, Student, AttendanceRecord, Grade, AutomationSettings, Teacher, TeacherEvaluation, LearningProfile, Exam, UserRole } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('edu_track_state_v9');
    if (saved) return JSON.parse(saved);
    return getInitialDB();
  });

  useEffect(() => {
    localStorage.setItem('edu_track_state_v9', JSON.stringify(state));
  }, [state]);

  const handleLogin = (role: UserRole, studentId?: string) => {
    setState(prev => ({ ...prev, currentUserRole: role, currentUserId: studentId }));
    setIsLoggedIn(true);
    setActiveTab(role === 'alumno' ? 'student-portal' : 'dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const resetDatabase = () => {
    if (window.confirm('¿Desea restaurar la configuración inicial?')) {
      const db = getInitialDB();
      setState(db);
      localStorage.setItem('edu_track_state_v9', JSON.stringify(db));
      setActiveTab('dashboard');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={state} />;
      case 'student-portal': return <StudentPortal studentId={state.currentUserId || ''} state={state} />;
      case 'academic-mgmt': return <AcademicManagement state={state} />;
      case 'students': return <StudentList students={state.students} onAddStudent={(s) => setState(p => ({...p, students: [...p.students, s]}))} onRemoveStudent={(id) => setState(p => ({...p, students: p.students.filter(s => s.id !== id)}))} />;
      case 'attendance': return <AttendanceTracker students={state.students} records={state.attendance} automation={state.automation} onSaveAttendance={(r) => setState(p => ({...p, attendance: [...p.attendance, ...r]}))} />;
      case 'exams': return <ExamManager exams={state.exams || []} onAddExam={(e) => setState(p => ({...p, exams: [e, ...p.exams]}))} onRemoveExam={(id) => setState(p => ({...p, exams: p.exams.filter(e => e.id !== id)}))} />;
      case 'grades': return <GradesTracker students={state.students} grades={state.grades} onAddGrade={(g) => setState(p => ({...p, grades: [g, ...p.grades]}))} onRemoveGrade={(id) => setState(p => ({...p, grades: p.grades.filter(g => g.id !== id)}))} />;
      case 'finances': return <FinanceManagement students={state.students} onUpdateStudent={(s) => setState(p => ({...p, students: p.students.map(st => st.id === s.id ? s : st)}))} />;
      case 'risk-analysis': return <RiskAnalysis state={state} />;
      case 'ai-insights': return <AIInsights state={state} />;
      case 'teacher-eval': return <TeacherEvaluationView state={state} onAddEvaluation={(e) => setState(p => ({...p, teacherEvaluations: [...p.teacherEvaluations, e]}))} />;
      case 'export': return <ExportTool state={state} onReset={resetDatabase} />;
      default: return <Dashboard state={state} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onSelectRole={handleLogin} students={state.students} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={state.currentUserRole} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
