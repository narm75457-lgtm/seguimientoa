
import React from 'react';
import { Student, Grade, AppState, Subject, Schedule } from '../types';
import { 
  GraduationCap, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  Archive,
  CheckCircle2,
  XCircle,
  TrendingUp,
  QrCode,
  Download,
  CreditCard,
  Target,
  User as UserIcon
} from 'lucide-react';

interface StudentPortalProps {
  studentId: string;
  state: AppState;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ studentId, state }) => {
  const student = state.students.find(s => s.id === studentId);
  const myGrades = state.grades.filter(g => g.studentId === studentId);
  const isBlocked = student?.financialStatus?.isBlocked;

  const mySchedules = state.schedules.map(sch => {
    const sub = state.subjects.find(s => s.id === sch.subjectId);
    if (sub && sub.career === student?.career) return { ...sch, subjectName: sub.name };
    return null;
  }).filter(Boolean);

  const gpa = myGrades.length > 0 
    ? (myGrades.reduce((a, b) => a + b.score, 0) / myGrades.length).toFixed(1)
    : "0.0";

  if (!student) return <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest">Error: Expediente no localizado en el SIAE.</div>;

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Nuevo Hero Estudiantil - Estética Apple/SaaS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border-b-[12px] border-red-600 group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none transform rotate-12 scale-150">
            <GraduationCap size={400} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <span className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-red-900/50">Matrícula: {student.id.toUpperCase()}</span>
              <span className="px-6 py-2 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10">{student.modality}</span>
            </div>
            
            <h2 className="text-7xl font-black mb-4 tracking-tight leading-none">
               <span className="text-slate-500 block text-2xl font-bold mb-4">Bienvenido de nuevo,</span>
               {student.name.split(' ')[0]}
            </h2>
            
            <div className="flex items-center gap-4 text-slate-400 text-xl font-medium mt-8">
              <Target className="text-red-500" size={24} />
              {student.career} <span className="w-2 h-2 bg-slate-700 rounded-full" /> {student.group}
            </div>

            <div className="mt-16 flex flex-wrap gap-8">
               <div className="text-center">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-2">Promedio General</p>
                  <p className="text-5xl font-black tracking-tighter">{gpa}</p>
               </div>
               <div className="w-px h-16 bg-white/10 hidden md:block" />
               <div className="text-center">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-2">Créditos Totales</p>
                  <p className="text-5xl font-black tracking-tighter">312 <span className="text-lg text-slate-500">/ 450</span></p>
               </div>
               <div className="w-px h-16 bg-white/10 hidden md:block" />
               <div className="text-center">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-2">Estatus Escolar</p>
                  <p className="text-5xl font-black tracking-tighter text-emerald-500">Regular</p>
               </div>
            </div>
          </div>
        </div>

        {/* Credencial Digital Interactiva */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-slate-100 flex flex-col items-center text-center justify-between group hover:border-red-200 transition-all">
           <div>
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-900 mb-6 shadow-inner mx-auto group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                <QrCode size={40} />
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-2">Identificación Digital</h4>
              <p className="text-sm text-slate-500 font-medium px-4">Utiliza este código para acceso al campus y laboratorios.</p>
           </div>
           
           <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 my-8 shadow-inner">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.id}`} 
                alt="QR Alumno" 
                className="w-32 h-32 opacity-80 group-hover:opacity-100 transition-opacity"
              />
           </div>

           <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-slate-200">
              <Download size={14} /> Descargar Credencial
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Horario con Estilo Moderno */}
          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                <Calendar className="text-red-600" size={32} /> Trayectoria Semanal
              </h3>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-5 py-2 rounded-full border border-slate-100">Cuatrimestre en curso</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mySchedules.length > 0 ? mySchedules.map((sch: any, i) => (
                <div key={i} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex items-start gap-6 hover:bg-white hover:border-red-200 hover:shadow-2xl hover:shadow-red-900/5 transition-all group">
                   <div className="w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                      <span className="text-[10px] font-black uppercase mb-1">{sch.day.substring(0,3)}</span>
                      <Clock size={20} />
                   </div>
                   <div className="flex-1">
                      <p className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em] mb-2">{sch.time}</p>
                      <p className="font-black text-slate-800 text-xl leading-tight mb-3">{sch.subjectName}</p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          <MapPin size={14} className="text-red-500" /> {sch.room}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          <UserIcon size={14} className="text-red-500" /> Catedrático
                        </div>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="col-span-2 py-16 text-center text-slate-300 font-bold uppercase tracking-widest text-sm border-2 border-dashed border-slate-100 rounded-[2.5rem]">No hay sesiones programadas para hoy.</div>
              )}
            </div>
          </div>

          {/* Kardex de Calificaciones Premium */}
          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                <Archive className="text-red-600" size={32} /> Reporte Académico (Kardex)
              </h3>
            </div>
            
            {isBlocked ? (
              <div className="py-24 flex flex-col items-center text-center gap-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner">
                <div className="w-24 h-24 bg-red-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-red-200">
                  <Lock size={40} />
                </div>
                <div className="max-w-md">
                  <h4 className="text-3xl font-black text-slate-800">Acceso Restringido</h4>
                  <p className="text-slate-500 font-medium mt-4 leading-relaxed">
                    Tu boleta oficial ha sido bloqueada debido a un adeudo administrativo pendiente. Favor de regularizar tu estatus en Tesorería.
                  </p>
                </div>
                <div className="px-10 py-4 bg-red-600/10 text-red-600 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-red-200">
                  Adeudo Pendiente: ${student.financialStatus?.debtAmount.toLocaleString()} MXN
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myGrades.map((g) => (
                  <div key={g.id} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:scale-[1.02] hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-8">
                       <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-sm ${g.score >= 6 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {g.score.toFixed(1)}
                       </div>
                       <div>
                          <p className="font-black text-slate-800 text-xl tracking-tight">{g.subject}</p>
                          <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{g.description} • Cuatrimestre Actual</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${g.score >= 6 ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'}`}>
                          {g.score >= 6 ? 'Acreditada' : 'No Acreditada'}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          
          {/* Documentación Escolar */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
            <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <FileText size={24} className="text-red-600" /> Archivo Digital RVOE
            </h4>
            <div className="space-y-4">
               {student.documents?.map((doc, i) => (
                 <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{doc.name}</span>
                    <div className="flex items-center gap-2">
                       {doc.isUploaded ? (
                         doc.isVerified ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Clock size={20} className="text-amber-500" />
                       ) : (
                         <XCircle size={20} className="text-red-500" />
                       )}
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
               <button className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] hover:underline">Subir Documentos Faltantes</button>
            </div>
          </div>

          {/* Tesorería y Pagos */}
          <div className="bg-[#0f172a] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 opacity-[0.05] group-hover:scale-110 transition-transform">
                <CreditCard size={180} />
             </div>
             <h4 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
                <CreditCard size={24} className="text-red-500" /> Estatus de Pago
             </h4>
             <div className="space-y-6 relative z-10">
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Próximo Vencimiento</p>
                   <p className="text-2xl font-black">15 de Junio, 2024</p>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo Actual</p>
                      <p className={`text-3xl font-black ${student.financialStatus?.hasDebt ? 'text-red-500' : 'text-emerald-500'}`}>
                         ${student.financialStatus?.debtAmount.toLocaleString()} <span className="text-xs text-slate-500">MXN</span>
                      </p>
                   </div>
                   <button className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/50">PAGAR AHORA</button>
                </div>
             </div>
          </div>

          {/* AI Guide Coach */}
          <div className="bg-red-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-red-200 relative overflow-hidden group">
            <div className="absolute -bottom-10 -left-10 opacity-10 transform -rotate-12">
               <Sparkles size={160} />
            </div>
            <h4 className="text-2xl font-black mb-6 flex items-center gap-4 relative z-10">
              <Sparkles size={28} /> AI Coach Académico
            </h4>
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 relative z-10">
               <p className="text-base font-medium leading-relaxed mb-8 italic">
                 "Tu rendimiento en el área de <span className="font-black text-white">Lógica Jurídica</span> sugiere un perfil analítico excepcional. Hemos agendado un taller de litigio avanzado para ti."
               </p>
               <button className="w-full py-4 bg-white text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Ver Recomendaciones Full</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
