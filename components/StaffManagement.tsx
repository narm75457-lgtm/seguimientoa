
import React, { useState } from 'react';
import { Teacher } from '../types';
import { UserPlus, Briefcase, Trash2, ShieldCheck, GraduationCap, Search, CheckCircle, Copy } from 'lucide-react';

interface StaffManagementProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onRemoveTeacher: (id: string) => void;
}

const DEPARTMENTS = [
  'Derecho',
  'Psicología',
  'Ingeniería y Sistemas',
  'Administración y Negocios',
  'Ciencias de la Educación',
  'Criminología'
];

const StaffManagement: React.FC<StaffManagementProps> = ({ teachers, onAddTeacher, onRemoveTeacher }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successData, setSuccessData] = useState<Teacher | null>(null);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    subject: '',
    department: DEPARTMENTS[0]
  });

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = 't-' + Math.random().toString(36).substr(2, 6);
    const teacherData: Teacher = {
      ...newTeacher,
      id: generatedId
    };
    onAddTeacher(teacherData);
    setSuccessData(teacherData);
    setNewTeacher({ name: '', email: '', subject: '', department: DEPARTMENTS[0] });
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-wrap gap-6 items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Censo de Personal Docente</h3>
          <p className="text-slate-500 font-medium">Administración de acceso para catedráticos y coordinadores.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200">
          <UserPlus size={18} />
          Registrar Catedrático
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                {teacher.name.charAt(0)}
              </div>
              <button onClick={() => onRemoveTeacher(teacher.id)} className="p-3 text-slate-200 hover:text-red-600 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-1">{teacher.name}</h4>
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-6">{teacher.department}</p>
            <div className="space-y-3 pt-6 border-t border-slate-50 text-slate-600 text-xs font-bold">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-slate-400" />
                {teacher.subject}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" /> Acceso: {teacher.id}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative">
            <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Alta de Catedrático</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nombre Completo</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={newTeacher.name} onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Email Personal / Inst.</label>
                <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={newTeacher.email} onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Asignatura</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={newTeacher.subject} onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-red-200">Alta Docente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-12 text-center border-t-[8px] border-slate-900 animate-scale-in">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={44} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">¡Catedrático Registrado!</h3>
             <p className="text-slate-500 font-medium mb-10 text-sm">El portal docente ya está habilitado para {successData.name}.</p>
             
             <div className="space-y-4 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-left mb-10">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Usuario Docente</p>
                   <p className="text-slate-900 font-bold">{successData.email}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contraseña (ID Empleado)</p>
                   <div className="flex items-center justify-between">
                      <p className="text-slate-900 font-black text-xl tracking-tighter">{successData.id}</p>
                      <button className="p-2 text-slate-400 hover:text-slate-900"><Copy size={16} /></button>
                   </div>
                </div>
             </div>

             <button onClick={() => setSuccessData(null)} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl">
                TERMINAR
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
