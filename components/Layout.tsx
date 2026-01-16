
import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  LayoutDashboard, 
  Download,
  Sparkles,
  UserCheck,
  MapPin,
  Phone,
  AlertTriangle,
  CreditCard,
  FileQuestion,
  LogOut,
  User as UserIcon,
  Bell,
  BookMarked,
  Search
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
    { id: 'dashboard', label: 'Tablero Principal', icon: LayoutDashboard, roles: ['control_escolar', 'coordinador'] },
    { id: 'announcements', label: 'Comunicados', icon: Bell, roles: ['alumno', 'maestro', 'control_escolar', 'coordinador'] },
    { id: 'student-portal', label: 'Mi Perfil Estudiantil', icon: UserIcon, roles: ['alumno'] },
    { id: 'academic-mgmt', label: 'Oferta Académica', icon: BookMarked, roles: ['control_escolar', 'coordinador'] },
    { id: 'students', label: 'Censo de Alumnos', icon: Users, roles: ['control_escolar', 'coordinador'] },
    { id: 'attendance', label: 'Registro de Asistencia', icon: CalendarCheck, roles: ['control_escolar', 'maestro'] },
    { id: 'exams', label: 'Evaluación Digital', icon: FileQuestion, roles: ['control_escolar', 'maestro', 'alumno'] },
    { id: 'grades', label: 'Control de Calificaciones', icon: GraduationCap, roles: ['control_escolar', 'maestro'] },
    { id: 'finances', label: 'Tesorería y Becas', icon: CreditCard, roles: ['control_escolar'] },
    { id: 'teacher-eval', label: 'Calidad Docente', icon: UserCheck, roles: ['control_escolar', 'coordinador', 'alumno'] },
    { id: 'risk-analysis', label: 'Retención (IA)', icon: AlertTriangle, roles: ['control_escolar', 'coordinador'] },
    { id: 'ai-insights', label: 'Analítica Avanzada', icon: Sparkles, roles: ['control_escolar', 'maestro', 'coordinador'] },
    { id: 'export', label: 'Reportes y Kardex', icon: Download, roles: ['control_escolar', 'coordinador'] },
  ];

  const navItems = allItems.filter(item => item.roles.includes(userRole));

  const roleLabels = {
    control_escolar: 'Dirección de Control Escolar',
    coordinador: 'Coordinación de Carrera',
    maestro: 'Cuerpo Académico',
    alumno: 'Estudiante Matriculado'
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar de alta gama */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col fixed h-full z-30 shadow-[10px_0_30px_rgba(0,0,0,0.05)]">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight leading-none">
              <span className="text-red-600 block text-[10px] uppercase tracking-[0.4em] mb-1">Universidad</span>
              FRAY DIEGO
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">Sistema SIAE v2.5</p>
        </div>

        <nav className="flex-1 px-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-red-600 text-white shadow-2xl shadow-red-900/50 scale-[1.02]' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon size={20} className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-8 mt-auto">
          <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-red-500 font-black">
                  {userRole.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sesión de</p>
                  <p className="text-xs font-bold text-white truncate max-w-[120px]">{roleLabels[userRole]}</p>
                </div>
             </div>
             <button 
                onClick={onLogout}
                className="w-full py-3 bg-slate-700 hover:bg-red-600 text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Finalizar Sesión
              </button>
          </div>
          <div className="mt-6 flex flex-col gap-2 opacity-30 px-2">
             <div className="flex items-center gap-2 text-[9px] text-slate-300 font-bold uppercase">
                <MapPin size={10} /> Pachuca de Soto, Hgo.
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content con Header Refinado */}
      <main className="ml-72 flex-1 p-12 min-h-screen">
        <header className="mb-12 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-6 z-20 p-6 rounded-[2.5rem] border border-white shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={20} />
               <input 
                  type="text" 
                  placeholder="Buscar en el SIAE..." 
                  className="pl-12 pr-6 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl w-80 text-sm focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium"
               />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right mr-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Periodo Escolar</p>
               <p className="text-sm font-black text-slate-900">CUATRI 2024-02</p>
            </div>
            <button className="relative p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 hover:shadow-lg transition-all">
              <Bell size={22} />
              <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-red-600 border-2 border-white rounded-full animate-pulse" />
            </button>
          </div>
        </header>

        <div className="animate-fade-in max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
