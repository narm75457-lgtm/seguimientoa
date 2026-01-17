
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ChevronRight, GraduationCap, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onSelectRole: (role: UserRole, studentId?: string) => void;
  students: { id: string, name: string, email: string }[];
  teachers: { id: string, name: string, email: string }[];
}

const Login: React.FC<LoginProps> = ({ onSelectRole, students, teachers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const emailLower = email.toLowerCase().trim();

      // 1. Acceso Administrativo (Control Escolar)
      if (emailLower === 'narm75457@gmail.com' && password === 'c202128456') {
        onSelectRole('control_escolar');
        return;
      }

      // 2. Acceso Alumno (Email + Matrícula como Contraseña)
      const student = students.find(s => s.email.toLowerCase() === emailLower);
      if (student && password === student.id) {
        onSelectRole('alumno', student.id);
        return;
      }

      // 3. Acceso Docente (Email + ID Empleado como Contraseña)
      const teacher = teachers.find(t => t.email.toLowerCase() === emailLower);
      if (teacher && password === teacher.id) {
         onSelectRole('maestro');
         return;
      }

      setError('Credenciales inválidas. El usuario es su correo institucional y la contraseña es su ID (Matrícula/Empleado).');
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[440px] relative z-30 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6 bg-red-600/10 px-5 py-2 rounded-full border border-red-600/20">
             <ShieldCheck size={14} className="text-red-600" />
             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Portal Oficial Fray Diego</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl border border-red-500/20 mb-4">
              <GraduationCap className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">SIAE <span className="text-red-600">CLOUD</span></h1>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[3.4rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-600/10 border border-red-600/20 p-5 rounded-2xl flex items-center gap-3">
                <AlertCircle className="text-red-600 shrink-0" size={20} />
                <p className="text-red-100 text-[10px] font-black leading-tight uppercase tracking-wider">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Correo Institucional</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={20} />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@fraydiego.edu.mx"
                  className="w-full pl-16 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-[2.2rem] text-white outline-none focus:border-red-600/40 font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Contraseña (Matrícula/ID)</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="st-xxxxxx"
                  className="w-full pl-16 pr-16 py-5 bg-white/[0.03] border border-white/10 rounded-[2.2rem] text-white outline-none focus:border-red-600/40 font-medium"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-6 bg-red-600 text-white rounded-[2.2rem] font-black text-sm uppercase tracking-[0.5em] shadow-xl hover:bg-red-700 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
              {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>INGRESAR AL PORTAL <ChevronRight size={18} /></>}
            </button>
          </form>
          
          <div className="mt-10 p-6 bg-white/5 rounded-[2rem] border border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center leading-relaxed">
              Sistema de Acceso Seguro SIAE Cloud<br/>Universidad Fray Diego © 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
