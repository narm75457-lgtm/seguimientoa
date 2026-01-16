
import React from 'react';
import { Student } from '../types';
import { CreditCard, ShieldCheck, ShieldAlert, Award, Lock, Unlock, DollarSign, Wallet } from 'lucide-react';

interface FinanceProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
}

const FinanceManagement: React.FC<FinanceProps> = ({ students, onUpdateStudent }) => {
  const toggleBlock = (student: Student) => {
    if (!student.financialStatus) return;
    onUpdateStudent({
      ...student,
      financialStatus: {
        ...student.financialStatus,
        isBlocked: !student.financialStatus.isBlocked
      }
    });
  };

  const stats = {
    totalDebt: students.reduce((acc, s) => acc + (s.financialStatus?.debtAmount || 0), 0),
    withDebt: students.filter(s => s.financialStatus?.hasDebt).length,
    withScholarship: students.filter(s => s.financialStatus?.hasScholarship).length,
    blocked: students.filter(s => s.financialStatus?.isBlocked).length
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Cartera Vencida', value: `$${stats.totalDebt.toLocaleString()}`, icon: DollarSign, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Alumnos Deudores', value: stats.withDebt, icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Becas Otorgadas', value: stats.withScholarship, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Accesos Bloqueados', value: stats.blocked, icon: Lock, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
              <item.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <h4 className="text-2xl font-black text-slate-800">{item.value}</h4>
          </div>
        ))}
      </div>

      {/* Finance Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <CreditCard className="text-red-600" /> Control de Tesorería Fray Diego
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-5">Estudiante</th>
                <th className="px-6 py-5">Beca</th>
                <th className="px-6 py-5">Adeudo</th>
                <th className="px-6 py-5">Estatus</th>
                <th className="px-6 py-5 text-right">Acción Académica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const finance = student.financialStatus;
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{student.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">{student.career}</p>
                    </td>
                    <td className="px-6 py-4">
                      {finance?.hasScholarship ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black">
                          {finance.scholarshipPercentage}% BECA
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-black uppercase">Sin Beca</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {finance?.hasDebt ? (
                        <span className="text-red-600">${finance.debtAmount.toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-600">$0</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {finance?.hasDebt ? (
                        <div className="flex items-center gap-2 text-red-500">
                          <ShieldAlert size={16} />
                          <span className="text-[10px] font-black uppercase">Pendiente</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-500">
                          <ShieldCheck size={16} />
                          <span className="text-[10px] font-black uppercase">Al Corriente</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleBlock(student)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ml-auto transition-all ${
                          finance?.isBlocked 
                            ? 'bg-red-600 text-white shadow-lg' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {finance?.isBlocked ? (
                          <><Lock size={14} /> Boleta Bloqueada</>
                        ) : (
                          <><Unlock size={14} /> Acceso Libre</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;
