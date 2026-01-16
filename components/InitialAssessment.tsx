
import React, { useState } from 'react';
import { LearningProfile } from '../types';
import { 
  Brain, 
  CheckCircle2, 
  User, 
  Compass, 
  Target, 
  Heart, 
  Eye, 
  Volume2, 
  Move, 
  BookOpen, 
  Calculator, 
  Palette,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

interface Props {
  profile?: LearningProfile;
  onComplete: (profile: LearningProfile) => void;
}

const QUESTIONS = [
  { id: 1, category: 'style', text: 'Para aprender conceptos de tu carrera prefieres:', options: [{ id: 'A', text: 'Analizar diagramas y mapas' }, { id: 'B', text: 'Escuchar conferencias o debates' }, { id: 'C', text: 'Hacer laboratorios o prácticas' }] },
  { id: 2, category: 'temperament', text: 'Ante un desafío académico intenso, sueles:', options: [{ id: 'A', text: 'Planificar con calma y rigor' }, { id: 'B', text: 'Busca apoyo y socializar dudas' }, { id: 'C', text: 'Actuar rápido y experimentar' }] },
  { id: 3, category: 'intelligence', text: '¿Qué área del conocimiento se te facilita más?', options: [{ id: 'A', text: 'Expresión oral y escrita' }, { id: 'B', text: 'Lógica y análisis numérico' }, { id: 'C', text: 'Diseño y visión espacial' }] },
  { id: 4, category: 'wellbeing', text: 'Últimamente en la universidad te sientes:', options: [{ id: 'A', text: 'Estable y motivado' }, { id: 'B', text: 'Cansado pero funcional' }, { id: 'C', text: 'Con carga emocional alta' }] },
  { id: 5, category: 'style', text: '¿Cómo retienes mejor la información?', options: [{ id: 'A', text: 'Con apuntes visuales' }, { id: 'B', text: 'Repitiendo en voz alta' }, { id: 'C', text: 'Tomando notas a mano' }] },
  { id: 6, category: 'temperament', text: 'Tus compañeros te describen como:', options: [{ id: 'A', text: 'Analítico y perfeccionista' }, { id: 'B', text: 'Empático y comunicativo' }, { id: 'C', text: 'Práctico y adaptable' }] },
  { id: 7, category: 'intelligence', text: 'Disfrutas más de:', options: [{ id: 'A', text: 'Debatir una tesis' }, { id: 'B', text: 'Modelar un proceso lógico' }, { id: 'C', text: 'Idear una solución creativa' }] },
  { id: 8, category: 'wellbeing', text: '¿Cómo manejas el estrés de exámenes?', options: [{ id: 'A', text: 'Con buena organización' }, { id: 'B', text: 'Necesito hablarlo con alguien' }, { id: 'C', text: 'Me cuesta concentrarme' }] },
  { id: 9, category: 'style', text: 'Prefieres que el docente:', options: [{ id: 'A', text: 'Use presentaciones gráficas' }, { id: 'B', text: 'Explique de forma elocuente' }, { id: 'C', text: 'Ponga ejercicios prácticos' }] },
  { id: 10, category: 'temperament', text: 'Te motiva más:', options: [{ id: 'A', text: 'Lograr el dominio del tema' }, { id: 'B', text: 'El reconocimiento grupal' }, { id: 'C', text: 'Ver resultados inmediatos' }] },
];

const InitialAssessment: React.FC<Props> = ({ profile, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [QUESTIONS[step].id]: optionId };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (allAnswers: Record<number, string>) => {
    const getWinner = (qIds: number[]) => {
      const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
      qIds.forEach(id => {
        if (allAnswers[id]) counts[allAnswers[id]]++;
      });
      return Object.entries(counts).reduce((a, b) => a[1] >= b[1] ? a : b)[0];
    };

    const sensoryWinner = getWinner([1, 5, 9]);
    const tempWinner = getWinner([2, 6, 10]);
    const intelWinner = getWinner([3, 7]);
    const wellWinner = getWinner([4, 8]);

    const profileResult: LearningProfile = {
      style: sensoryWinner === 'A' ? 'Visual' : sensoryWinner === 'B' ? 'Auditivo' : 'Kinestésico',
      temperament: tempWinner === 'A' ? 'Reflexivo / Estable' : tempWinner === 'B' ? 'Emocional / Expresivo' : 'Impulsivo / Adaptable',
      intelligence: intelWinner === 'A' ? 'Lingüística' : intelWinner === 'B' ? 'Lógico-Matemática' : 'Espacial / Creativa',
      wellbeing: wellWinner === 'A' ? 'Estable' : wellWinner === 'B' ? 'Atención Preventiva' : 'Alerta (Carga Alta)',
      completedAt: new Date().toISOString()
    };

    onComplete(profileResult);
  };

  if (profile) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 p-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <Compass className="absolute -top-10 -left-10 w-64 h-64 rotate-12" />
              <Target className="absolute -bottom-10 -right-10 w-64 h-64 -rotate-12" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Brain size={48} className="text-white" />
              </div>
              <h3 className="text-5xl font-black mb-4 tracking-tight">Informe Psicopedagógico</h3>
              <p className="text-xl text-red-100 font-medium opacity-90">Análisis detallado de tu perfil de aprendizaje Fray Diego.</p>
            </div>
          </div>

          <div className="p-8 md:p-16 space-y-12">
            {/* Categoría: Temperamento */}
            <section className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
                  <User size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-800">Temperamento Dominante</h4>
                  <p className="text-red-600 font-bold uppercase tracking-widest text-xs">{profile.temperament}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                  <h5 className="font-bold text-slate-400 uppercase tracking-tighter text-xs">Características</h5>
                  <ul className="space-y-2 text-slate-600">
                    {profile.temperament === 'Reflexivo / Estable' ? (
                      <><li>• Procesamiento profundo</li><li>• Alta autorregulación</li><li>• Estilo analítico</li></>
                    ) : profile.temperament === 'Emocional / Expresivo' ? (
                      <><li>• Alta sociabilidad</li><li>• Sensibilidad interpersonal</li><li>• Motivación extrínseca</li></>
                    ) : (
                      <><li>• Búsqueda de novedad</li><li>• Estilo exploratorio</li><li>• Gran flexibilidad</li></>
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="font-bold text-slate-400 uppercase tracking-tighter text-xs">Fortalezas</h5>
                  <ul className="space-y-2 text-slate-600">
                    {profile.temperament === 'Reflexivo / Estable' ? (
                      <><li>• Persistencia alta</li><li>• Estudio autónomo eficaz</li></>
                    ) : profile.temperament === 'Emocional / Expresivo' ? (
                      <><li>• Aprendizaje colaborativo</li><li>• Empatía grupal</li></>
                    ) : (
                      <><li>• Tareas prácticas</li><li>• Creatividad aplicada</li></>
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="font-bold text-slate-400 uppercase tracking-tighter text-xs">Riesgos</h5>
                  <ul className="space-y-2 text-rose-500 font-medium">
                    {profile.temperament === 'Reflexivo / Estable' ? (
                      <><li>• Perfeccionismo excesivo</li></>
                    ) : profile.temperament === 'Emocional / Expresivo' ? (
                      <><li>• Dependencia de validación</li></>
                    ) : (
                      <><li>• Baja tolerancia a rutina</li></>
                    )}
                  </ul>
                </div>
              </div>
            </section>

            {/* Categoría: Modalidad Sensorial */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-50/50 rounded-[2.5rem] p-10 border border-red-100 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                    {profile.style === 'Visual' ? <Eye size={24} /> : profile.style === 'Auditivo' ? <Volume2 size={24} /> : <Move size={24} />}
                  </div>
                  <h4 className="text-xl font-black text-slate-800">Canal: {profile.style}</h4>
                </div>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Tu procesamiento de información es mayormente {profile.style.toLowerCase()}. 
                  {profile.style === 'Visual' ? ' Retienes mejor mediante gráficos y mapas.' : 
                   profile.style === 'Auditivo' ? ' Retienes mejor mediante diálogos y audio.' : 
                   ' Aprendes haciendo y mediante el movimiento.'}
                </p>
                <div className="mt-auto">
                   <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3">Estrategias Óptimas</h5>
                   <div className="flex flex-wrap gap-2">
                     {profile.style === 'Visual' && ['Mapas Mentales', 'Infografías'].map(t => <span key={t} className="px-3 py-1 bg-white text-red-700 rounded-full text-xs font-bold border border-red-200">{t}</span>)}
                     {profile.style === 'Auditivo' && ['Podcasts', 'Debates'].map(t => <span key={t} className="px-3 py-1 bg-white text-red-700 rounded-full text-xs font-bold border border-red-200">{t}</span>)}
                     {profile.style === 'Kinestésico' && ['Simulaciones', 'Prácticas'].map(t => <span key={t} className="px-3 py-1 bg-white text-red-700 rounded-full text-xs font-bold border border-red-200">{t}</span>)}
                   </div>
                </div>
              </div>

              {/* Categoría: Inteligencia */}
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-lg">
                    {profile.intelligence === 'Lingüística' ? <BookOpen size={24} /> : profile.intelligence === 'Lógico-Matemática' ? <Calculator size={24} /> : <Palette size={24} />}
                  </div>
                  <h4 className="text-xl font-black text-slate-800">{profile.intelligence}</h4>
                </div>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                   Presentas una tendencia hacia la inteligencia {profile.intelligence.toLowerCase()}. 
                   Este es tu modo natural de resolver problemas académicos.
                </p>
                <div className="mt-auto flex items-center gap-2">
                   <ShieldAlert size={16} className="text-red-500" />
                   <p className="text-[10px] text-slate-500 font-bold uppercase italic">Perfil Orientativo SIAE</p>
                </div>
              </div>
            </section>

            {/* Categoría: Bienestar */}
            <section className={`rounded-[2.5rem] p-10 border flex items-center gap-8 ${profile.wellbeing === 'Estable' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg ${profile.wellbeing === 'Estable' ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-red-600 text-white shadow-red-100'}`}>
                {profile.wellbeing === 'Estable' ? <Heart size={40} /> : <AlertCircle size={40} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-2xl font-black text-slate-800">Estado Psicoemocional</h4>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${profile.wellbeing === 'Estable' ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                    {profile.wellbeing}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                  {profile.wellbeing === 'Estable' ? 'Recursos psicológicos adaptativos adecuados para el éxito cuatrimestral.' : 
                   'Se observa fatiga moderada. Se recomienda optimizar tiempos y buscar tutoría.'}
                </p>
              </div>
            </section>
          </div>
          
          <div className="p-12 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-6">
             <button 
               onClick={() => onComplete(undefined as any)} 
               className="px-10 py-4 bg-white text-slate-600 rounded-2xl font-black text-sm shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
             >
               REINICIAR EVALUACIÓN
             </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = QUESTIONS[step];

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
           <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <div className="mb-10 text-center">
          <span className="text-xs font-black text-red-600 bg-red-50 px-4 py-2 rounded-full uppercase tracking-widest">SIAE Fray Diego - Pregunta {step + 1} / {QUESTIONS.length}</span>
          <h3 className="text-3xl font-black text-slate-800 mt-6 leading-tight">{currentQ.text}</h3>
        </div>
        <div className="space-y-4">
          {currentQ.options.map((opt) => (
            <button 
              key={opt.id} 
              onClick={() => handleSelect(opt.id)} 
              className="w-full p-6 text-left rounded-3xl bg-slate-50 border-2 border-transparent hover:border-red-600 hover:bg-red-50/30 transition-all group flex items-center justify-between"
            >
              <span className="text-lg font-bold text-slate-800 group-hover:text-red-600 transition-colors">{opt.text}</span>
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                <CheckCircle2 size={24} className="text-slate-200 group-hover:text-white transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InitialAssessment;
