
import React from 'react';
import { AppState } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { Users, TrendingUp, AlertTriangle, CheckCircle2, GraduationCap, DollarSign, Wallet, ShieldCheck, Activity } from 'lucide-react';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const totalStudents = state.students.length;
  const avgGrade = state.grades.length > 0 
    ? (state.grades.reduce((acc, curr) => acc + curr.score, 0) / state.grades.length).toFixed(1)
    : "0.0";

  const attendanceRate = state.attendance.length > 0
    ? ((state.attendance.filter(a => a.status === 'present').length / state.attendance.length) * 100).toFixed(0)
    : 100;

  const deudores = state.students.filter(s => s.financialStatus?.hasDebt).length;

  const careerData = state.students.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.career);
    if (existing) existing.value += 1;
    else acc.push({ name: curr.career, value: 1 });
    return acc;
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Institutional Hero */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl border-b-[10px] border-red-700">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none transform rotate-12 scale-150">
          <GraduationCap size={400} />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <span className="bg-red-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-red-900/40">SIAE Corporate</span>
               <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            </div>
            <h2 className="text-7xl font-black tracking-tighter mb-6 leading-[0.9]">Inteligencia Académica</h2>
            <p className="text-slate-400 font-bold text-xl max-w-lg leading-relaxed opacity-80">
              Análisis integral de rendimiento y gestión institucional para la excelencia educativa.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] group hover:bg-white/10 transition-colors">
                <Activity className="text-red-500 mb-4" size={32} />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Índice de Retención</p>
                <p className="text-4xl font-black text-white">92.4%</p>
             </div>
             <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] group hover:bg-white/10 transition-colors">
                <ShieldCheck className="text-emerald-500 mb-4" size={32} />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Estatus RVOE</p>
                <p className="text-4xl font-black text-emerald-400">Vigente</p>
             </div>
          </div>
        </div>
      </div>

      {/* KPI Grid with Professional Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Censo Total', value: totalStudents, icon: Users, color: 'bg-red-600', shadow: 'shadow-red-900/10', textColor: 'text-red-600' },
          { label: 'Promedio Global', value: avgGrade, icon: TrendingUp, color: 'bg-[#0f172a]', shadow: 'shadow-slate-900/10', textColor: 'text-slate-900' },
          { label: 'Tasa de Asistencia', value: `${attendanceRate}%`, icon: CheckCircle2, color: 'bg-emerald-600', shadow: 'shadow-emerald-900/10', textColor: 'text-emerald-600' },
          { label: 'Cartera en Mora', value: deudores, icon: Wallet, color: 'bg-orange-600', shadow: 'shadow-orange-900/10', textColor: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-10 rounded-[3rem] shadow-xl ${stat.shadow} border border-slate-50 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform`} />
            <div className={`${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-6 transition-transform`}>
              <stat.icon size={30} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className={`text-5xl font-black tracking-tighter ${stat.textColor}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Population Area Chart */}
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Población Estudiantil</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Distribución por Programa Académico</p>
            </div>
            <div className="flex gap-2">
               <span className="w-3 h-3 bg-red-600 rounded-full" />
               <span className="w-3 h-3 bg-slate-200 rounded-full" />
               <span className="w-3 h-3 bg-slate-200 rounded-full" />
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={careerData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }} />
                <Area type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={5} fillOpacity={1} fill="url(#chartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Pie Chart */}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
          <div className="w-full text-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tesorería</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Estatus de Pagos Corrientes</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[
                    { name: 'Regularizado', value: state.students.length - deudores },
                    { name: 'En Mora', value: deudores }
                  ]} 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={10} 
                  dataKey="value"
                >
                  <Cell fill="#0f172a" />
                  <Cell fill="#dc2626" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-10 p-8 bg-[#f8fafc] rounded-[2.5rem] w-full text-center border border-slate-100 shadow-inner">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimado de Morosidad</p>
             <p className="text-4xl font-black text-red-600 tracking-tighter">${(deudores * 3200).toLocaleString()}</p>
             <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Divisa: MXN</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
