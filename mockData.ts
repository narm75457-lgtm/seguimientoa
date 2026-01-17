
import { AppState, Student, Teacher, Grade, AttendanceRecord, TeacherEvaluation, Subject, Schedule, Announcement, UserRole } from './types';

const CAREERS = [
  'Derecho', 'Criminología y Criminalística', 'Psicología', 'Administración y Estrategias de Negocios',
  'Ingeniería en Logística Internacional', 'Ingeniería Industrial', 'Pedagogía (Ciencias de la Educación)', 'Ingeniería en Software y Sistemas'
];

const generateSubjects = (): Subject[] => [
  { id: 'sub-1', name: 'Derecho Penal I', credits: 7, career: 'Derecho', term: 1 },
  { id: 'sub-2', name: 'Teoría General del Proceso', credits: 8, career: 'Derecho', term: 1 },
  { id: 'sub-3', name: 'Psicología del Desarrollo', credits: 6, career: 'Psicología', term: 3 },
  { id: 'sub-4', name: 'Programación Orientada a Objetos', credits: 10, career: 'Ingeniería en Software y Sistemas', term: 5 },
  { id: 'sub-5', name: 'Logística de Almacenes', credits: 8, career: 'Ingeniería en Logística Internacional', term: 4 },
];

const generateAnnouncements = (): Announcement[] => [
  { id: 'ann-1', title: 'Reinscripciones Ciclo 2024-B', content: 'Inicia el proceso de reinscripción del 1 al 15 de Agosto. Favor de acudir con su comprobante de pago.', category: 'Académico', targetRoles: ['alumno', 'control_escolar'], date: '2024-05-20' },
  { id: 'ann-2', title: 'Actualización de Protocolos de Examen', content: 'Se les recuerda a los docentes que los exámenes deben subirse al sistema con 48 hrs de antelación.', category: 'Académico', targetRoles: ['maestro', 'coordinador'], date: '2024-05-18' },
  { id: 'ann-3', title: 'Campaña de Salud Mental', content: 'Conversatorio gratuito en el auditorio sobre el manejo del estrés académico.', category: 'Evento', targetRoles: ['alumno', 'maestro', 'coordinador'], date: '2024-05-22' },
];

const generateStudents = (): Student[] => [
  { 
    id: 'st-1', name: 'Carlos Mendoza', email: 'c.mendoza@fraydiego.edu.mx', tutorEmail: 'parent.mendoza@mail.com', group: '1º Cuatri', career: 'Derecho', modality: 'Escolarizado', 
    profile: { style: 'Visual', intelligence: 'Lingüística', temperament: 'Reflexivo / Estable', wellbeing: 'Estable', completedAt: '2024-01-15' }, 
    financialStatus: { hasScholarship: true, scholarshipPercentage: 20, hasDebt: false, debtAmount: 0, isBlocked: false, lastPaymentDate: '2024-05-01' },
    documents: [
      { name: 'Acta de Nacimiento', isUploaded: true, isVerified: true },
      { name: 'Certificado Bachillerato', isUploaded: true, isVerified: false },
      { name: 'CURP', isUploaded: true, isVerified: true }
    ]
  },
  { 
    id: 'st-2', name: 'Lucía Fernández', email: 'l.fernandez@fraydiego.edu.mx', tutorEmail: 'tutor.lucia@mail.com', group: '3º Cuatri', career: 'Psicología', modality: 'En línea', 
    profile: { style: 'Kinestésico', intelligence: 'Espacial / Creativa', temperament: 'Emocional / Expresivo', wellbeing: 'Estable', completedAt: '2024-01-16' }, 
    financialStatus: { hasScholarship: false, hasDebt: true, debtAmount: 2500, isBlocked: true, lastPaymentDate: '2024-03-15' },
    documents: [
      { name: 'Acta de Nacimiento', isUploaded: true, isVerified: true },
      { name: 'Certificado Bachillerato', isUploaded: false, isVerified: false }
    ]
  },
];

export const getInitialDB = (): AppState => {
  const students = generateStudents();
  const subjects = generateSubjects();
  return {
    currentUserRole: 'control_escolar',
    students,
    teachers: [
      // Fix: Added missing 'email' property to Teacher mock data
      { id: 't1', name: 'Dr. Roberto Sánchez', email: 'r.sanchez@fraydiego.edu.mx', subject: 'Derecho Penal I', department: 'Derecho' },
      // Fix: Added missing 'email' property to Teacher mock data
      { id: 't2', name: 'Dra. Elena Martínez', email: 'e.martinez@fraydiego.edu.mx', subject: 'Psicología Infantil', department: 'Psicología' }
    ],
    subjects,
    schedules: [
      { subjectId: 'sub-1', teacherId: 't1', day: 'Lunes', time: '08:00 - 10:00', room: 'A-101' },
      { subjectId: 'sub-1', teacherId: 't1', day: 'Miércoles', time: '08:00 - 10:00', room: 'A-101' },
    ],
    announcements: generateAnnouncements(),
    attendance: [],
    grades: [
      { id: 'g1', studentId: 'st-1', subject: 'Derecho Penal I', score: 9.5, date: '2024-05-01', description: 'Parcial I' },
      { id: 'g2', studentId: 'st-1', subject: 'Teoría del Derecho', score: 8.0, date: '2024-05-01', description: 'Parcial I' },
    ],
    exams: [],
    teacherEvaluations: [],
    automation: { webhookUrl: '', threshold: 3, enabled: false },
    userProfile: undefined
  };
};