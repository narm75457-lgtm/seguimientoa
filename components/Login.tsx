
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ShieldCheck, User, BookOpen, Settings2, GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginProps {
  onSelectRole: (role: UserRole, studentId?: string) => void;
  students: { id: string, name: string, email: string }[];
}

const Login: React.FC<LoginProps> = ({ onSelectRole, students }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'form' | 'demo'>('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Credenciales específicas solicitadas por el usuario
    if (email === 'narm75457@gmail.com' && password === 'c202128456') {
      onSelectRole('control_escolar'); // Acceso total como administrador/control escolar
      return;
    }

    // Validación para alumnos existentes (usando su matricula como password por defecto para el demo)
    const student = students.find(s => s.email === email);
    if (student && password === student.id) {
      onSelectRole('alumno', student.id);
      return;
    }

    setError('Las credenciales ingresadas son incorrectas. Verifique su correo y contraseña.');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full -mr-64 -mt-64 blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full -ml-64 -mb-64 blur-[120px]" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-900/50 transform hover:rotate-12 transition-transform duration-500">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">SIAE</h1>
          <p className="text-red-500 font-bold text-xs uppercase tracking-[0.4em]">Universidad Fray Diego</p>
        </div>

        {loginMode === 'form' ? (
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl animate-fade-in">
            <h2 className="text-xl font-black text-white mb-8 text-center uppercase tracking-widest">Portal de Ingreso</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-start gap-3 animate-shake">
                  <AlertCircle className="text-red-500 shrink-0" size={18} />
                  <p className="text-red-200 text-xs font-medium leading-relaxed">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@fraydiego.edu.mx"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:bg-white/10 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 transition-all font-medium placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contraseña</label>
                  <button type="button" className="text-[10px] font-black text-red-500 uppercase hover:underline">¿Olvidó su clave?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:bg-white/10 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 transition-all font-medium placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-900/50 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 mt-4"
              >
                Acceder al Sistema
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => setLoginMode('demo')}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Explorar otros roles (Demo)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center mb-6">
                <p className="text-slate-400 text-xs font-medium">Seleccione un perfil para demostración rápida de funcionalidades.</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'control_escolar', label: 'Admin', icon: Settings2 },
                  { id: 'maestro', label: 'Docente', icon: BookOpen },
                  { id: 'coordinador', label: 'Coord.', icon: ShieldCheck },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => onSelectRole(role.id as UserRole)}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center hover:bg-white hover:text-slate-900 transition-all group flex flex-col items-center"
                  >
                    <role.icon className="text-slate-500 group-hover:text-red-600 mb-2" size={24} />
                    <span className="font-black text-[10px] uppercase tracking-widest">{role.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setLoginMode('form')}
                  className="bg-red-600/10 border border-red-600/20 p-6 rounded-3xl text-center hover:bg-red-600 text-white transition-all group flex flex-col items-center col-span-1"
                >
                  <Mail className="mb-2" size={24} />
                  <span className="font-black text-[10px] uppercase tracking-widest">Regresar</span>
                </button>
             </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.4em] mb-4">Seguridad Institucional RVOE • 2024</p>
          <div className="flex justify-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-red-500 transition-colors">Aviso de Privacidad</a>
            <span className="opacity-20">|</span>
            <a href="#" className="hover:text-red-500 transition-colors">Soporte Técnico</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
