import React, { useState, useEffect } from 'react';
import { 
  X, Phone, MessageCircle, Mail, Calendar, 
  Save, CheckCircle, User, Send, MoreHorizontal
} from 'lucide-react';

// 1. Definimos la estructura del Cliente (debe coincidir con la de ConsultoriaView)
export interface ClientRecord {
  id: number;
  fechaCarga: string;
  caller: string;
  derivados: string;
  razonSocial: string;
  contacto: string;
  tel1: string;
  status: string;
  observaciones?: string;
  fechaAlta?: string;
  tel2?: string;
  [key: string]: any;
}

// 2. Aquí definimos las props que acepta el componente
interface RecordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: ClientRecord; 
  // Esta es la línea que faltaba y causa el error:
  onUpdateRecord?: (id: number, field: string, value: any) => void;
}

export function RecordDrawer({ isOpen, onClose, record, onUpdateRecord }: RecordDrawerProps) {
  const [activeTab, setActiveTab] = useState<'detalle' | 'historial'>('detalle');
  const [note, setNote] = useState('');
  // Inicializamos con un string vacío si observaciones es undefined
  const [currentObservaciones, setCurrentObservaciones] = useState(record?.observaciones || '');

  // Sincronizar observaciones cuando cambia el registro seleccionado
  useEffect(() => {
    setCurrentObservaciones(record?.observaciones || '');
  }, [record]);

  // Manejador para guardar las observaciones
  const handleSave = () => {
    if (onUpdateRecord && record) {
      onUpdateRecord(record.id, 'observaciones', currentObservaciones);
    }
    onClose();
  };

  // Manejadores de acciones reales
  const handleCall = () => {
    if (!record.tel1) return;
    window.location.href = `tel:${record.tel1}`;
  };

  const handleWhatsApp = () => {
    if (!record.tel1) return;
    const cleanNumber = record.tel1.replace(/\D/g, ''); 
    const formattedNumber = cleanNumber.startsWith('54') ? cleanNumber : `549${cleanNumber}`;
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:cliente@ejemplo.com`;
  };

  if (!isOpen || !record) return null;

  return (
    <>
      {/* Overlay Oscuro */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Panel Lateral */}
      <div className={`fixed inset-y-0 right-0 w-[500px] bg-[#0A0A0A] border-l border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-start bg-gray-950">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  record.status === 'Contactar Luego' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  record.status === 'Nuevo' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  record.status === 'Cerrado' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  'bg-gray-800 text-gray-400 border-gray-700'
               }`}>
                 {record.status}
               </span>
               <span className="text-gray-500 text-xs">ID: {record.id}</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{record.razonSocial}</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
              <User className="w-3 h-3" /> {record.contacto}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="grid grid-cols-3 gap-2 px-6 py-4 border-b border-gray-800">
           <ActionButton icon={Phone} label="Llamar" color="text-green-400" hover="hover:bg-green-950/30" onClick={handleCall} />
           <ActionButton icon={MessageCircle} label="WhatsApp" color="text-emerald-400" hover="hover:bg-emerald-950/30" onClick={handleWhatsApp} />
           <ActionButton icon={Mail} label="Email" color="text-blue-400" hover="hover:bg-blue-950/30" onClick={handleEmail} />
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-800 px-6">
           <Tab label="Detalle del Cliente" active={activeTab === 'detalle'} onClick={() => setActiveTab('detalle')} />
           <Tab label="Bitácora / Historial" active={activeTab === 'historial'} onClick={() => setActiveTab('historial')} />
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'detalle' ? (
            <div className="space-y-6">
               <Section title="Información de Contacto">
                  <Field label="Teléfono Principal" value={record.tel1} icon={Phone} onUpdate={(val) => onUpdateRecord?.(record.id, 'tel1', val)} />
                  <Field label="Teléfono Secundario" value={record.tel2 || "-"} icon={Phone} onUpdate={(val) => onUpdateRecord?.(record.id, 'tel2', val)} />
                  <Field label="Email" value="pendiente@email.com" icon={Mail} />
               </Section>

               <Section title="Datos de Gestión">
                  <Field label="Fecha de Carga" value={record.fechaCarga} icon={Calendar} />
                  <Field label="Asignado a" value={record.caller} icon={User} />
                  <Field label="Derivado" value={record.derivados || 'No'} icon={CheckCircle} />
               </Section>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Observaciones Generales</label>
                 <textarea 
                   className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-blue-600 min-h-[100px]"
                   placeholder="Agregar notas sobre la empresa..."
                   value={currentObservaciones}
                   onChange={(e) => setCurrentObservaciones(e.target.value)}
                 />
               </div>
            </div>
          ) : (
            <div className="space-y-4">
               <div className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Escribe una nota rápida..." 
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-blue-600"
                  />
                  <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg">
                    <Send className="w-4 h-4" />
                  </button>
               </div>

               <div className="relative border-l border-gray-800 ml-2 space-y-6">
                  <TimelineItem date="Hoy, 10:30 AM" user="Juan" action="Cambio de estado" text="Cambió el estado a 'Contactar Luego'" />
                  <TimelineItem date="02-Dec-25" user="Sistema" action="Creación" text="Registro importado." />
               </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
             Cerrar (Esc)
           </button>
           <button onClick={handleSave} className="px-6 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
             <Save className="w-3 h-3" /> Guardar Cambios
           </button>
        </div>

      </div>
    </>
  );
}

// --- SUBCOMPONENTES ---

function ActionButton({ icon: Icon, label, color, hover, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border border-gray-800 bg-gray-900/50 transition-all ${hover} group active:scale-95`}>
       <Icon className={`w-4 h-4 ${color}`} />
       <span className="text-[10px] font-medium text-gray-400 group-hover:text-white">{label}</span>
    </button>
  )
}

function Tab({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors ${active ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
    >
      {label}
    </button>
  )
}

function Section({ title, children }: any) {
  return (
    <div className="space-y-3">
       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
         {title} <div className="h-px bg-gray-800 flex-1"></div>
       </h3>
       <div className="grid grid-cols-1 gap-3">
         {children}
       </div>
    </div>
  )
}

interface FieldProps {
  label: string;
  value: string;
  icon: React.ElementType;
  onUpdate?: (value: any) => void;
}

function Field({ label, value, icon: Icon, onUpdate }: FieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => { setCurrentValue(value); }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onUpdate && currentValue !== value) {
      onUpdate(currentValue);
    }
  };

  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-2 text-gray-500 w-1/3">
          <Icon className="w-3.5 h-3.5" />
          <span className="text-xs">{label}</span>
       </div>
       <div className="flex-1">
          {onUpdate && isEditing ? (
            <input 
              type="text" 
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') handleBlur(); }}
              autoFocus
              className="w-full bg-gray-700 border border-blue-600 rounded-sm px-2 py-1 text-sm text-white focus:outline-none"
            />
          ) : (
            <div 
              onClick={() => onUpdate && setIsEditing(true)} 
              className={`flex items-center justify-between py-1 px-2 rounded-sm ${onUpdate ? 'hover:bg-gray-900 cursor-pointer' : ''} transition-colors`}
            >
              <span className="text-sm text-white">{value || '-'}</span>
              {onUpdate && <MoreHorizontal className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>
          )}
       </div>
    </div>
  )
}

function TimelineItem({ date, user, action, text }: any) {
  return (
    <div className="pl-6 relative">
       <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-gray-800 border-2 border-black"></div>
       <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-bold text-white">{user}</span>
          <span className="text-[10px] text-gray-500">{date}</span>
       </div>
       <p className="text-xs text-blue-400 font-medium mb-0.5">{action}</p>
       <p className="text-sm text-gray-400 leading-snug">{text}</p>
    </div>
  )
}