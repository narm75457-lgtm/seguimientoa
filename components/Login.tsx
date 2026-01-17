
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ChevronRight, GraduationCap, Zap, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onSelectRole: (role: UserRole, studentId?: string) => void;
  students: { id: string, name: string, email: string }[];
}

const Login: React.FC<LoginProps> = ({ onSelectRole, students }) => {
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
      // Credenciales de Control Escolar
      if (email === 'narm75457@gmail.com' && password === 'c202128456') {
        onSelectRole('control_escolar');
        return;
      }

      // Credenciales de Alumno
      const student = students.find(s => s.email === email);
      if (student && password === student.id) {
        onSelectRole('alumno', student.id);
        return;
      }

      setError('Acceso denegado. Verifique sus credenciales institucionales.');
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans selection:bg-red-600 selection:text-white p-6 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo (No son imágenes) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[440px] relative z-30 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6 bg-red-600/10 px-5 py-2 rounded-full border border-red-600/20">
             <ShieldCheck size={14} className="text-red-600" />
             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Servidor Institucional v3.5</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-500/20 mb-4">
              <GraduationCap className="text-white" size={40} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase">
              SIAE <span className="text-red-600">CLOUD</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Universidad Fray Diego</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-red-600/20 to-transparent rounded-[3.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative bg-slate-900/60 backdrop-blur-3xl p-10 lg:p-14 rounded-[3.4rem] border border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-600/10 border border-red-600/20 p-5 rounded-2xl flex items-center gap-3 animate-shake">
                  <AlertCircle className="text-red-600 shrink-0" size={20} />
                  <p className="text-red-100 text-[11px] font-bold leading-tight uppercase tracking-wider">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Matrícula o Correo</label>
                <div className="relative group/input">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-red-600 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@fraydiego.edu.mx"
                    className="w-full pl-16 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-[2.2rem] text-white outline-none focus:bg-white/[0.05] focus:border-red-600/40 transition-all font-medium placeholder:text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Contraseña</label>
                <div className="relative group/input">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-red-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-16 pr-16 py-5 bg-white/[0.03] border border-white/10 rounded-[2.2rem] text-white outline-none focus:bg-white/[0.05] focus:border-red-600/40 transition-all font-medium placeholder:text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-red-600 text-white rounded-[2.2rem] font-black text-sm uppercase tracking-[0.5em] shadow-[0_20px_50px_-10px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 mt-6 disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    INGRESAR AL PORTAL
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-14 pt-10 border-t border-white/5 text-center">
              <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.4em] leading-loose">
                CONTROL Y GESTIÓN ACADÉMICA<br/>
                © UNIVERSIDAD FRAY DIEGO
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
