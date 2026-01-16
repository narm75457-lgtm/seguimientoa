
import React from 'react';
import { AppState, Student } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend 
} from 'recharts';
import { Users, TrendingUp, AlertTriangle, CheckCircle2, GraduationCap, Globe, DollarSign, Wallet } from 'lucide-react';

interface DashboardProps {
  state: AppState;
}

const COLORS = ['#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const totalStudents = state.students.length;
  const avgGrade = state.grades.length > 0 
    ? (state.grades.reduce((acc, curr) => acc + curr.score, 0) / state.grades.length).toFixed(1)
    : "0.0";

  const attendanceRate = state.attendance.length > 0
    ? ((state.attendance.filter(a => a.status === 'present').length / state.attendance.length) * 100).toFixed(0)
    : 0;

  const totalAbsences = state.attendance.filter(a => a.status === 'absent').length;

  // Dropout Risk Calculation
  const studentsAtCriticalRisk = state.students.filter(student => {
    const studentGrades = state.grades.filter(g => g.studentId === student.id);
    const avg = studentGrades.length > 0 ? studentGrades.reduce((a, b) => a + b.score, 0) / studentGrades.length : 10;
    const studentAtt = state.attendance.filter(a => a.studentId === student.id);
    const rate = studentAtt.length > 0 ? (studentAtt.filter(a => a.status === 'present').length / studentAtt.length) * 100 : 100;
    return avg < 6.5 || rate < 75;
  }).length;

  // Financial Health Calculation
  const financeData = [
    { name: 'Al Corriente', value: state.students.filter(s => !s.financialStatus?.hasDebt).length },
    { name: 'Con Adeudo', value: state.students.filter(s => s.financialStatus?.hasDebt).length },
  ];

  const careerDistribution = state.students.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.career);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.career, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Widget */}
      <div className="bg-red-600 rounded-[2.5rem] p-8 text-white flex flex-col lg:flex-row items-center justify-between shadow-2xl shadow-red-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GraduationCap size={160} />
        </div>
        <div className="relative z-10">
          <p className="text-red-100 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Panel Administrativo</p>
          <h3 className="text-4xl font-black mb-4">Bienvenido al SIAE</h3>
          <p className="text-red-500 bg-white inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Universidad Fray Diego</p>
        </div>
        
        <div className="mt-6 lg:mt-0 flex gap-4">
           {/* Risk Card */}
           <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
              <div className="bg-white p-3 rounded-2xl text-red-600">
                <AlertTriangle className="animate-pulse" size={24} />
              </div>
              <div>
                <p className="text-red-100 font-bold text-xs uppercase opacity-70">Riesgo Crítico</p>
                <p className="text-3xl font-black">{studentsAtCriticalRisk}</p>
              </div>
           </div>
           {/* Finance Quick Alert */}
           <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
              <div className="bg-amber-400 p-3 rounded-2xl text-slate-900">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-red-100 font-bold text-xs uppercase opacity-70">En Morosidad</p>
                <p className="text-3xl font-black">{financeData[1].value}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Población', value: totalStudents, icon: Users, color: 'bg-red-500' },
          { label: 'Rendimiento', value: avgGrade, icon: TrendingUp, color: 'bg-emerald-500' },
          { label: 'Asistencia', value: `${attendanceRate}%`, icon: CheckCircle2, color: 'bg-blue-500' },
          { label: 'Cartera', value: financeData[1].value, icon: Wallet, color: 'bg-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-xl shadow-current/30`}>
                <stat.icon size={22} />
              </div>
            </div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Distribution */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-8">
            <DollarSign size={18} className="text-red-500" /> Estatus de Tesorería
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={financeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution by Career */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-8">
            <GraduationCap size={18} className="text-red-500" /> Alumnos por Programa Académico
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={careerDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#fff1f2'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
