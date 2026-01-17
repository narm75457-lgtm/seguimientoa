
import React, { useState } from 'react';
import { Student, Modality, FinancialStatus } from '../types';
import { UserPlus, Search, Trash2, Mail, ShieldAlert, Filter, GraduationCap, CreditCard, DollarSign, CheckCircle, Copy, X } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onRemoveStudent: (id: string) => void;
}

const CAREERS = [
  'Derecho',
  'Criminología y Criminalística',
  'Psicología',
  'Administración y Estrategias de Negocios',
  'Ingeniería en Logística Internacional',
  'Ingeniería Industrial',
  'Pedagogía (Ciencias de la Educación)',
  'Ingeniería en Software y Sistemas'
];

const MODALITIES: Modality[] = ['En línea', 'Escolarizado', 'Ejecutivo'];

const StudentList: React.FC<StudentListProps> = ({ students, onAddStudent, onRemoveStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [careerFilter, setCareerFilter] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [successData, setSuccessData] = useState<Student | null>(null);
  
  const [newStudent, setNewStudent] = useState({ 
    name: '', 
    email: '', 
    tutorEmail: '', 
    group: '', 
    career: CAREERS[0], 
    modality: 'Escolarizado' as Modality,
    hasScholarship: false,
    scholarshipPercentage: 0,
    hasInitialDebt: false,
    initialDebtAmount: 0
  });

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCareer = careerFilter ? s.career === careerFilter : true;
    const matchesModality = modalityFilter ? s.modality === modalityFilter : true;
    return matchesSearch && matchesCareer && matchesModality;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const generatedId = 'st-' + Math.random().toString(36).substr(2, 6);
    
    const financialStatus: FinancialStatus = {
      hasScholarship: newStudent.hasScholarship,
      scholarshipPercentage: newStudent.hasScholarship ? newStudent.scholarshipPercentage : 0,
      hasDebt: newStudent.hasInitialDebt,
      debtAmount: newStudent.hasInitialDebt ? newStudent.initialDebtAmount : 0,
      isBlocked: newStudent.hasInitialDebt,
      lastPaymentDate: new Date().toISOString().split('T')[0]
    };

    const studentData: Student = {
      id: generatedId,
      name: newStudent.name,
      email: newStudent.email,
      tutorEmail: newStudent.tutorEmail,
      group: newStudent.group,
      career: newStudent.career,
      modality: newStudent.modality,
      financialStatus: financialStatus,
      documents: [
        { name: 'Acta de Nacimiento', isUploaded: false, isVerified: false },
        { name: 'CURP', isUploaded: false, isVerified: false }
      ]
    };

    onAddStudent(studentData);
    setSuccessData(studentData);
    setNewStudent({ 
      name: '', email: '', tutorEmail: '', group: '', career: CAREERS[0], modality: 'Escolarizado',
      hasScholarship: false, scholarshipPercentage: 0, hasInitialDebt: false, initialDebtAmount: 0
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o cuatrimestre..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-slate-900 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
            value={careerFilter}
            onChange={(e) => setCareerFilter(e.target.value)}
          >
            <option value="">Todas las Carreras</option>
            {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 font-black uppercase tracking-widest text-[10px]"
        >
          <UserPlus size={18} />
          Registrar Nuevo Alumno
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
            <tr>
              <th className="px-6 py-4">Matrícula / Alumno</th>
              <th className="px-6 py-4">Programa</th>
              <th className="px-6 py-4">Estatus Acceso</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none mb-1">{student.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {student.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[11px] font-bold text-slate-700">{student.career}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase">{student.modality}</p>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${student.financialStatus?.isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {student.financialStatus?.isBlocked ? 'Bloqueado' : 'Activo'}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onRemoveStudent(student.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Registro */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 relative">
            <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Ficha de Inscripción</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nombre Completo</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Email Institucional</label>
                  <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Programa Académico</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={newStudent.career} onChange={(e) => setNewStudent({...newStudent, career: e.target.value})}>
                    {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-red-200">Generar Perfil</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Éxito (Credenciales) */}
      {successData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-12 text-center border-t-[8px] border-red-600 animate-scale-in">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={44} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">¡Inscripción Exitosa!</h3>
             <p className="text-slate-500 font-medium mb-10 text-sm leading-relaxed">Se han generado las credenciales de acceso para el alumno.</p>
             
             <div className="space-y-4 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-left mb-10">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Usuario (Email)</p>
                   <p className="text-slate-900 font-bold break-all">{successData.email}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contraseña (Matrícula)</p>
                   <div className="flex items-center justify-between">
                      <p className="text-red-600 font-black text-xl tracking-tighter">{successData.id}</p>
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Copy size={16} /></button>
                   </div>
                </div>
             </div>

             <button onClick={() => setSuccessData(null)} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl">
                ENTENDIDO, CONTINUAR
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
