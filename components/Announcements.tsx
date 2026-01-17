
import React, { useState, useRef } from 'react';
import { Announcement, UserRole } from '../types';
import { Bell, Megaphone, Calendar, Plus, Trash2, Info, AlertTriangle, PartyPopper, CreditCard, FileText, Upload, X, Download } from 'lucide-react';

interface AnnouncementsProps {
  announcements: Announcement[];
  userRole: UserRole;
  onAddAnnouncement: (announcement: Announcement) => void;
  onRemoveAnnouncement: (id: string) => void;
}

const CATEGORIES = [
  { label: 'Académico', icon: Info, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Tesorería', icon: CreditCard, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { label: 'Evento', icon: PartyPopper, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { label: 'Urgente', icon: AlertTriangle, color: 'bg-red-50 text-red-600 border-red-100' },
];

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'alumno', label: 'Estudiantes' },
  { value: 'maestro', label: 'Docentes' },
  { value: 'coordinador', label: 'Coordinación' },
  { value: 'control_escolar', label: 'Control Escolar' }
];

const Announcements: React.FC<AnnouncementsProps> = ({ announcements, userRole, onAddAnnouncement, onRemoveAnnouncement }) => {
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfFile, setPdfFile] = useState<{ name: string, data: string } | null>(null);
  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    category: 'Académico' as Announcement['category'],
    targetRoles: ['alumno'] as UserRole[]
  });

  const isStaff = userRole === 'control_escolar' || userRole === 'coordinador';
  
  const visibleAnnouncements = announcements.filter(ann => 
    ann.targetRoles.includes(userRole) || isStaff
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPdfFile({
          name: file.name,
          data: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Por favor selecciona un archivo PDF válido.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAnnouncement({
      ...newAnn,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      pdfData: pdfFile?.data,
      pdfName: pdfFile?.name
    });
    setShowForm(false);
    setNewAnn({ title: '', content: '', category: 'Académico', targetRoles: ['alumno'] });
    setPdfFile(null);
  };

  const toggleRole = (role: UserRole) => {
    setNewAnn(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role) 
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const downloadPdf = (pdfData: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Megaphone className="text-red-600" size={28} />
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Comunicados Institucionales</h2>
          </div>
          <p className="text-slate-500 font-medium">Información oficial y avisos de la Universidad Fray Diego.</p>
        </div>
        
        {isStaff && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-8 py-3.5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-200 hover:-translate-y-1 transition-all"
          >
            <Plus size={18} />
            Publicar Aviso
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-red-50 animate-slide-down">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título del Mensaje</label>
                <input
                  required
                  type="text"
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 transition-colors text-slate-900 font-bold placeholder:text-slate-300"
                  value={newAnn.title}
                  placeholder="Ej: Suspensión de Labores"
                  onChange={(e) => setNewAnn({...newAnn, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</label>
                <select
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 transition-colors text-slate-900 appearance-none font-bold"
                  value={newAnn.category}
                  onChange={(e) => setNewAnn({...newAnn, category: e.target.value as any})}
                >
                  {CATEGORIES.map(cat => <option key={cat.label} value={cat.label}>{cat.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contenido del Comunicado</label>
              <textarea
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 transition-colors text-slate-900 min-h-[120px] font-medium placeholder:text-slate-300"
                value={newAnn.content}
                placeholder="Escribe el mensaje institucional detallado..."
                onChange={(e) => setNewAnn({...newAnn, content: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirigido a:</label>
                <div className="flex flex-wrap gap-3">
                  {ROLES.map(role => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => toggleRole(role.value)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        newAnn.targetRoles.includes(role.value)
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-red-600'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjunto Académico (PDF)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${pdfFile ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-red-400 bg-slate-50'}`}
                >
                  <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  {pdfFile ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-emerald-800 truncate">{pdfFile.name}</p>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase">Archivo Cargado</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                        className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-slate-400 mb-2" size={24} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Subir Circular / PDF</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-red-100 hover:bg-red-700">
                Lanzar Comunicado
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-10 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[11px]">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {visibleAnnouncements.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100">
            <Bell size={64} className="mx-auto text-slate-100 mb-6" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay comunicados oficiales por el momento.</p>
          </div>
        ) : (
          visibleAnnouncements.map((ann) => {
            const categoryInfo = CATEGORIES.find(c => c.label === ann.category) || CATEGORIES[0];
            return (
              <div key={ann.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${categoryInfo.color} flex items-center gap-2`}>
                        <categoryInfo.icon size={12} />
                        {ann.category}
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} />
                        {ann.date}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-red-600 transition-colors leading-tight">
                      {ann.title}
                    </h3>
                    
                    <p className="text-slate-600 font-medium leading-relaxed mb-6">
                      {ann.content}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audiencia:</p>
                        <div className="flex gap-1.5">
                          {ann.targetRoles.map(role => (
                            <span key={role} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                              {role === 'control_escolar' ? 'Dirección' : role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {ann.pdfData && (
                        <button 
                          onClick={() => downloadPdf(ann.pdfData!, ann.pdfName || 'circular-ufd.pdf')}
                          className="flex items-center gap-3 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all group/btn"
                        >
                          <FileText size={16} />
                          <div className="text-left">
                            <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">{ann.pdfName}</p>
                            <p className="text-[8px] font-bold opacity-60 uppercase flex items-center gap-1">
                              <Download size={8} /> Descargar Circular
                            </p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {isStaff && (
                    <div className="flex flex-col justify-start">
                      <button 
                        onClick={() => onRemoveAnnouncement(ann.id)}
                        className="p-3 text-slate-200 hover:text-red-600 hover:bg-red-50 transition-all rounded-2xl border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Announcements;
