
import React, { useState } from 'react';
import { Student, Modality, FinancialStatus } from '../types';
import { UserPlus, Search, Trash2, Mail, ShieldAlert, Filter, GraduationCap, Globe, CreditCard, DollarSign } from 'lucide-react';

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
    
    const financialStatus: FinancialStatus = {
      hasScholarship: newStudent.hasScholarship,
      scholarshipPercentage: newStudent.hasScholarship ? newStudent.scholarshipPercentage : 0,
      hasDebt: newStudent.hasInitialDebt,
      debtAmount: newStudent.hasInitialDebt ? newStudent.initialDebtAmount : 0,
      isBlocked: newStudent.hasInitialDebt, // Bloquear automáticamente si tiene adeudo inicial
      lastPaymentDate: new Date().toISOString().split('T')[0]
    };

    onAddStudent({
      id: Math.random().toString(36).substr(2, 9),
      name: newStudent.name,
      email: newStudent.email,
      tutorEmail: newStudent.tutorEmail,
      group: newStudent.group,
      career: newStudent.career,
      modality: newStudent.modality,
      financialStatus: financialStatus
    });

    setNewStudent({ 
      name: '', email: '', tutorEmail: '', group: '', career: CAREERS[0], modality: 'Escolarizado',
      hasScholarship: false, scholarshipPercentage: 0, hasInitialDebt: false, initialDebtAmount: 0
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o cuatrimestre..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
            value={careerFilter}
            onChange={(e) => setCareerFilter(e.target.value)}
          >
            <option value="">Todas las Carreras</option>
            {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
          >
            <option value="">Todas las Modalidades</option>
            {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 font-bold"
        >
          <UserPlus size={18} />
          Crear Perfil Estudiante
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-[0.1em]">
              <tr>
                <th className="px-6 py-4">Alumno</th>
                <th className="px-6 py-4">Carrera / Programa</th>
                <th className="px-6 py-4">Modalidad</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <Search size={48} strokeWidth={1} />
                      <p className="text-slate-500 font-bold">No se encontraron perfiles con esos criterios.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-red-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm border border-red-100">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none mb-1">{student.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.group}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <GraduationCap size={16} className="text-red-500" />
                      {student.career}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      student.modality === 'En línea' ? 'bg-blue-50 text-blue-600' : 
                      student.modality === 'Escolarizado' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {student.modality}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} className="text-red-400" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldAlert size={12} className="text-amber-500" />
                        {student.tutorEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onRemoveStudent(student.id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 animate-scale-in border border-slate-100 overflow-y-auto max-h-[90vh] relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-800">Crear Nuevo Perfil Estudiantil</h3>
              <p className="text-slate-500 font-medium mt-1">Universidad Fray Diego - Control Escolar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sección Académica */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <GraduationCap size={18} className="text-red-600" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información Académica</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nombre Completo</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Cuatrimestre / Grupo</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: 3º Cuatri"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                      value={newStudent.group}
                      onChange={(e) => setNewStudent({...newStudent, group: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Programa Académico</label>
                    <select
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all appearance-none"
                      value={newStudent.career}
                      onChange={(e) => setNewStudent({...newStudent, career: e.target.value})}
                    >
                      {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Modalidad</label>
                    <select
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all appearance-none"
                      value={newStudent.modality}
                      onChange={(e) => setNewStudent({...newStudent, modality: e.target.value as Modality})}
                    >
                      {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email Institucional</label>
                    <input
                      required
                      type="email"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Sección Financiera */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <CreditCard size={18} className="text-red-600" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información Financiera (Becas y Pagos)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        className="w-5 h-5 rounded-lg border-slate-300 text-red-600 focus:ring-red-500"
                        checked={newStudent.hasScholarship}
                        onChange={(e) => setNewStudent({...newStudent, hasScholarship: e.target.checked})}
                      />
                      <span className="text-sm font-bold text-slate-700">¿Cuenta con Beca?</span>
                    </label>
                    {newStudent.hasScholarship && (
                      <div className="animate-fade-in">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Porcentaje de Beca (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                          value={newStudent.scholarshipPercentage}
                          onChange={(e) => setNewStudent({...newStudent, scholarshipPercentage: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        className="w-5 h-5 rounded-lg border-slate-300 text-red-600 focus:ring-red-500"
                        checked={newStudent.hasInitialDebt}
                        onChange={(e) => setNewStudent({...newStudent, hasInitialDebt: e.target.checked})}
                      />
                      <span className="text-sm font-bold text-slate-700">¿Registrar adeudo inicial?</span>
                    </label>
                    {newStudent.hasInitialDebt && (
                      <div className="animate-fade-in relative">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Monto del Adeudo ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input
                            type="number"
                            className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                            value={newStudent.initialDebtAmount}
                            onChange={(e) => setNewStudent({...newStudent, initialDebtAmount: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <p className="text-[10px] text-red-500 mt-2 font-bold leading-tight">* El acceso a calificaciones se bloqueará automáticamente.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                >
                  GUARDAR PERFIL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
