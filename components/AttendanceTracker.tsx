
import React, { useState } from 'react';
import { Student, AttendanceRecord, AttendanceStatus, AutomationSettings } from '../types';
import { CheckCircle, XCircle, Clock, Save, Loader2, Calendar } from 'lucide-react';

interface AttendanceTrackerProps {
  students: Student[];
  records: AttendanceRecord[];
  automation: AutomationSettings;
  onSaveAttendance: (newRecords: AttendanceRecord[]) => void;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ students, records, automation, onSaveAttendance }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, AttendanceStatus>>(
    students.reduce((acc, s) => {
      const existing = records.find(r => r.studentId === s.id && r.date === date);
      acc[s.id] = existing?.status || 'present';
      return acc;
    }, {} as Record<string, AttendanceStatus>)
  );

  const toggleStatus = (studentId: string, status: AttendanceStatus) => {
    setCurrentAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setLoading(true);
    const newRecords: AttendanceRecord[] = Object.entries(currentAttendance).map(([studentId, status]) => ({
      studentId,
      date,
      status: status as AttendanceStatus
    }));

    onSaveAttendance(newRecords);

    if (automation.enabled && automation.webhookUrl) {
      for (const record of newRecords) {
        if (record.status === 'absent') {
          const studentAbsences = [
            ...records.filter(r => r.studentId === record.studentId && r.status === 'absent' && r.date !== date),
            record
          ].length;

          if (studentAbsences >= automation.threshold) {
            const student = students.find(s => s.id === record.studentId);
            if (student) {
              try {
                await fetch(automation.webhookUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    studentName: student.name,
                    tutorEmail: student.tutorEmail,
                    totalAbsences: studentAbsences,
                    career: student.career
                  })
                });
              } catch (e) { console.error(e); }
            }
          }
        }
      }
    }

    setLoading(false);
    alert('Asistencia Fray Diego guardada correctamente.');
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800">Control de Asistencia Diaria</h3>
          <p className="text-slate-500 font-medium mt-1">Selecciona la fecha para registrar el pase de lista institucional.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />
             <input
                type="date"
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-700"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50 font-black"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            GUARDAR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50 group hover:border-red-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-black text-slate-800 text-lg leading-tight">{student.name}</p>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">{student.career}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => toggleStatus(student.id, 'present')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${currentAttendance[student.id] === 'present' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
              >
                <CheckCircle size={16} /><span className="text-[10px] font-black uppercase">P</span>
              </button>
              <button
                onClick={() => toggleStatus(student.id, 'absent')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${currentAttendance[student.id] === 'absent' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
              >
                <XCircle size={16} /><span className="text-[10px] font-black uppercase">F</span>
              </button>
              <button
                onClick={() => toggleStatus(student.id, 'late')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${currentAttendance[student.id] === 'late' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
              >
                <Clock size={16} /><span className="text-[10px] font-black uppercase">R</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTracker;
