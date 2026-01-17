
import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  LayoutDashboard, 
  Download,
  Sparkles,
  UserCheck,
  AlertTriangle,
  CreditCard,
  FileQuestion,
  LogOut,
  User as UserIcon,
  Bell,
  BookMarked,
  Search,
  ChevronRight,
  ShieldCheck,
  Server
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, onLogout }) => {
  const allItems = [
    { id: 'dashboard', label: 'Dashboard Institucional', icon: LayoutDashboard, roles: ['control_escolar', 'coordinador'] },
    { id: 'announcements', label: 'Comunicados', icon: Bell, roles: ['alumno', 'maestro', 'control_escolar', 'coordinador'] },
    { id: 'student-portal', label: 'Expediente Alumno', icon: UserIcon, roles: ['alumno'] },
    { id: 'academic-mgmt', label: 'Oferta Académica', icon: BookMarked, roles: ['control_escolar', 'coordinador'] },
    { id: 'students', label: 'Censo Estudiantil', icon: Users, roles: ['control_escolar', 'coordinador'] },
    { id: 'attendance', label: 'Asistencia', icon: CalendarCheck, roles: ['control_escolar', 'maestro'] },
    { id: 'exams', label: 'Evaluaciones Digitales', icon: FileQuestion, roles: ['control_escolar', 'maestro', 'alumno'] },
    { id: 'grades', label: 'Calificaciones RVOE', icon: GraduationCap, roles: ['control_escolar', 'maestro'] },
    { id: 'finances', label: 'Control Financiero', icon: CreditCard, roles: ['control_escolar'] },
    { id: 'teacher-eval', label: 'Calidad Docente', icon: UserCheck, roles: ['control_escolar', 'coordinador', 'alumno'] },
    { id: 'risk-analysis', label: 'Análisis de Retención', icon: AlertTriangle, roles: ['control_escolar', 'coordinador'] },
    { id: 'ai-insights', label: 'Inteligencia de Datos', icon: Sparkles, roles: ['control_escolar', 'maestro', 'coordinador'] },
    { id: 'export', label: 'Exportación de Datos', icon: Download, roles: ['control_escolar', 'coordinador'] },
  ];

  const navItems = allItems.filter(item => item.roles.includes(userRole));

  const roleLabels = {
    control_escolar: 'Dirección General',
    coordinador: 'Coordinación',
    maestro: 'Docente Académico',
    alumno: 'Portal de Estudiante'
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans selection:bg-red-600 selection:text-white">
      {/* Sidebar Corporativo Premium */}
      <aside className="w-80 bg-[#0f172a] text-white flex flex-col fixed h-full z-40 border-r-[8px] border-red-700 shadow-2xl">
        {/* Branding Section */}
        <div className="p-12 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40">
              <GraduationCap className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none">
                <span className="text-red-600 block text-[9px] font-black uppercase tracking-[0.4em] mb-1.5 opacity-80">Universidad</span>
                FRAY DIEGO
              </h1>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent my-6" />
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto custom-scrollbar pb-10">
          <p className="px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Menú Principal</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-red-600 text-white shadow-xl shadow-red-900/40 scale-[1.02]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'group-hover:text-red-500 transition-colors'} />
                <span className={`text-xs tracking-tight ${activeTab === item.id ? 'font-black' : 'font-bold'}`}>{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight size={14} className="opacity-50" />}
            </button>
          ))}
        </nav>
        
        {/* Footer Sidebar / Session Card */}
        <div className="p-8">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black shadow-lg">
                  {userRole.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sesión Activa</p>
                  <p className="text-xs font-black truncate max-w-[130px] uppercase text-white">{roleLabels[userRole]}</p>
                </div>
             </div>
             <button 
                onClick={onLogout}
                className="w-full py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-red-500/20"
              >
                <LogOut size={14} /> Finalizar Sesión
              </button>
          </div>
          <p className="text-[8px] text-slate-600 font-black text-center mt-6 uppercase tracking-widest opacity-50">SIAE v3.0.0 • Institutional Cloud</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-80 flex-1 p-14 bg-[#f8fafc]">
        {/* Modern Professional Header */}
        <header className="mb-14 flex justify-between items-center bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-8 z-30 border-t-[6px] border-red-700">
          <div className="flex items-center gap-8">
             <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                   type="text" 
                   placeholder="Búsqueda institucional..." 
                   className="pl-14 pr-8 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl w-[400px] text-xs focus:bg-white focus:ring-[8px] focus:ring-red-50 focus:border-red-600/30 transition-all outline-none font-bold"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right px-6 border-r border-slate-100 hidden md:flex">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Servidor Académico</p>
               <div className="flex items-center gap-2 justify-end mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-xs font-black text-slate-800 tracking-tight uppercase">Activo (HGO-MAIN)</p>
               </div>
            </div>
            
            <div className="flex gap-3">
              <button className="relative p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-lg transition-all">
                <Bell size={20} />
                <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full" />
              </button>
              
              <div className="flex items-center gap-3 bg-slate-900 text-white pl-5 pr-2 py-1.5 rounded-xl border border-slate-800 shadow-xl ml-2 group cursor-pointer hover:bg-red-700 transition-all duration-500">
                 <span className="text-[10px] font-black uppercase tracking-widest">Gestión</span>
                 <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-90 transition-transform">
                    <ShieldCheck size={18} />
                 </div>
              </div>
            </div>
          </div>
        </header>

        <div className="animate-fade-in max-w-[1500px] mx-auto">
          {children}
        </div>

        {/* Global Institutional Footer */}
        <footer className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 text-red-600 rounded-xl flex items-center justify-center font-black text-xs">UFD</div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                © 2024 UNIVERSIDAD FRAY DIEGO<br/>TECNOLOGÍA EDUCATIVA DE VANGUARDIA
              </p>
           </div>
           <div className="flex gap-10">
              <div className="flex items-center gap-3">
                <Server size={14} className="text-red-600" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sincronizado vía Supabase Cloud</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles size={14} className="text-red-600" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Powered by Google GenAI v3</span>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
