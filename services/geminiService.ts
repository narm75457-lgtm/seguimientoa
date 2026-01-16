
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, Student, ExamQuestion } from "../types";

const UNIVERSIDAD_CONTEXT = `
CONTEXTO INSTITUCIONAL - UNIVERSIDAD FRAY DIEGO:
Modalidades: En línea, Escolarizado y Ejecutivo.
Duración: 9 cuatrimestres. Certificación RVOE.
Carreras: Derecho, Criminología, Psicología, Administración, Logística, Industrial, Pedagogía, Software.
`;

export const generateExamQuestions = async (subject: string): Promise<ExamQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Usted es el Diseñador Curricular de la Universidad Fray Diego.
    Su tarea es generar 5 preguntas de opción múltiple de alta calidad para un examen de nivel licenciatura.
    Asignatura: ${subject}.
    Las preguntas deben ser desafiantes, académicamente rigurosas y alineadas a planes de estudio mexicanos con RVOE.
    Debe devolver estrictamente un objeto JSON que siga el esquema proporcionado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un banco de 5 preguntas para la materia de ${subject}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    minItems: 4,
                    maxItems: 4
                  },
                  correctAnswer: { 
                    type: Type.INTEGER,
                    description: "Índice de la opción correcta (0 a 3)"
                  }
                },
                required: ["id", "text", "options", "correctAnswer"]
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.questions.map((q: any) => ({
      ...q,
      id: Math.random().toString(36).substr(2, 9)
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};

export const analyzeDropoutRisk = async (student: Student, avgGrade: number, attendanceRate: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Usted actúa como la Coordinación de Éxito y Permanencia Estudiantil de la Universidad Fray Diego.
    Su función es emitir dictámenes técnicos y formales sobre el riesgo de deserción de los estudiantes, basándose en un análisis exhaustivo de:
    1. Desempeño Académico (Promedio actual: ${avgGrade}/10)
    2. Registro de Asistencia (${attendanceRate}%)
    3. Estado de Bienestar Psicopedagógico (${student.profile?.wellbeing || 'Pendiente de evaluación'})
    
    El informe debe presentarse con una estructura formal:
    - Dictamen de Riesgo: (Nivel Crítico, Alto, Medio o Estable)
    - Justificación Técnica: Análisis de los factores de riesgo detectados.
    - Protocolo de Intervención: Acciones institucionales recomendadas (tutorías especializadas, canalización psicológica, revisión de modalidad).
    
    Mantenga un tono institucional, preciso y propositivo, evitando lenguaje excesivamente coloquial.
  `;

  const prompt = `
    Solicitud de Dictamen para el alumno: ${student.name}
    Programa Académico: ${student.career}
    Perfil de Aprendizaje: ${student.profile?.style || 'No definido'}
    Temperamento Identificado: ${student.profile?.temperament || 'No definido'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction }
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing dropout risk:", error);
    return "Error en la generación del dictamen técnico. Por favor, consulte con la Dirección Académica.";
  }
};

export const getClassInsights = async (state: AppState, userQuery?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Usted es el Sistema de Inteligencia Académica (SIAE) de la Universidad Fray Diego.
    Su misión es asistir al personal docente en el análisis de indicadores de grupo y proporcionar información institucional veraz.
    
    ${UNIVERSIDAD_CONTEXT}
    
    Si el usuario solicita análisis de rendimiento, procese los datos estadísticos.
    Si el usuario consulta sobre procesos administrativos o académicos, utilice el contexto institucional.
    REGLA DE SEGURIDAD: En caso de no contar con información específica o ante consultas fuera de su competencia, debe proporcionar los datos de contacto oficiales:
    5547616079 | 7731348146
    universidadfray@gmail.com
  `;

  const prompt = userQuery || `
    Realice una auditoría de rendimiento del grupo actual:
    Estudiantes: ${JSON.stringify(state.students)}
    Calificaciones: ${JSON.stringify(state.grades)}
    Asistencia: ${JSON.stringify(state.attendance)}
    
    Genere un reporte ejecutivo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return "Error de conexión con el servidor de inteligencia académica.";
  }
};
