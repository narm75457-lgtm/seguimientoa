
export type UserRole = 'control_escolar' | 'coordinador' | 'maestro' | 'alumno';

export interface LearningProfile {
  style: 'Visual' | 'Auditivo' | 'Kinestésico';
  intelligence: 'Lingüística' | 'Lógico-Matemática' | 'Espacial / Creativa';
  temperament: 'Reflexivo / Estable' | 'Emocional / Expresivo' | 'Impulsivo / Adaptable';
  wellbeing: 'Estable' | 'Atención Preventiva' | 'Alerta (Carga Alta)';
  completedAt: string;
}

export type Modality = 'En línea' | 'Escolarizado' | 'Ejecutivo';

export interface DocumentStatus {
  name: string;
  isUploaded: boolean;
  isVerified: boolean;
}

export interface FinancialStatus {
  hasScholarship: boolean;
  scholarshipPercentage?: number;
  hasDebt: boolean;
  debtAmount: number;
  isBlocked: boolean;
  lastPaymentDate?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  tutorEmail: string;
  group: string;
  career: string;
  modality: Modality;
  profile?: LearningProfile;
  financialStatus?: FinancialStatus;
  documents?: DocumentStatus[];
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  career: string;
  term: number;
}

export interface Schedule {
  subjectId: string;
  teacherId: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';
  time: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Académico' | 'Tesorería' | 'Evento' | 'Urgente';
  targetRoles: UserRole[];
  date: string;
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  career: string;
  questions: ExamQuestion[];
  status: 'Draft' | 'Published';
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  department: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: AttendanceStatus;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  date: string;
  description: string;
}

export interface TeacherEvaluation {
  id: string;
  teacherId: string;
  studentId: string;
  date: string;
  period: string;
  scores: {
    clarity: number;
    material: number;
    punctuality: number;
    support: number;
  };
  comment: string;
}

export interface AutomationSettings {
  webhookUrl: string;
  threshold: number;
  enabled: boolean;
}

export interface AppState {
  currentUserRole: UserRole;
  currentUserId?: string;
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  schedules: Schedule[];
  announcements: Announcement[];
  attendance: AttendanceRecord[];
  grades: Grade[];
  exams: Exam[];
  teacherEvaluations: TeacherEvaluation[];
  automation: AutomationSettings;
  userProfile?: LearningProfile;
}
