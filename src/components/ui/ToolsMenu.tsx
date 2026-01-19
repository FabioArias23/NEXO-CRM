import React, { useState, useRef, useEffect } from 'react';
import { 
  Wrench, ChevronDown, Puzzle, Settings, 
  LayoutTemplate, CalendarClock, Briefcase, ChevronRight
} from 'lucide-react';

export function ToolsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { 
      icon: Puzzle, 
      title: 'Extensiones', 
      desc: 'Ampliar funcionalidades de la base',
      action: () => console.log('Abrir Marketplace')
    },
    { 
      icon: Settings, 
      title: 'Gestionar campos', 
      desc: 'Editar campos y dependencias',
      action: () => console.log('Gestor de campos')
    },
    { 
      icon: LayoutTemplate, 
      title: 'Plantillas de registro', 
      desc: 'Diseñar layouts de impresión',
      action: () => console.log('Plantillas')
    },
    { 
      icon: CalendarClock, 
      title: 'Dependencias de fecha', 
      desc: 'Diagramas de Gantt y plazos',
      action: () => console.log('Dependencias')
    },
    { 
      icon: Briefcase, 
      title: 'Perspectivas (Business)', 
      desc: 'Vistas avanzadas para socios',
      isPro: true,
      action: () => console.log('Business upgrade')
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isOpen ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
      >
        Herramientas
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#121212] border border-gray-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="p-3 bg-gray-950 border-b border-gray-800">
             <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
               <Wrench className="w-3 h-3" /> Herramientas de Base
             </h3>
          </div>
          
          <div className="p-2 space-y-1">
            {menuItems.map((item, index) => (
              <button 
                key={index}
                onClick={() => { item.action(); setIsOpen(false); }}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-900/80 transition-colors group text-left"
              >
                <div className="mt-0.5 p-2 bg-gray-900 rounded-md group-hover:bg-gray-800 transition-colors border border-gray-800 group-hover:border-gray-700">
                   <item.icon className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-gray-200 group-hover:text-white">{item.title}</span>
                     {item.isPro && <span className="text-[9px] bg-gradient-to-r from-amber-500 to-orange-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">PRO</span>}
                   </div>
                   <p className="text-[10px] text-gray-500 group-hover:text-gray-400 mt-0.5 leading-snug">
                     {item.desc}
                   </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 opacity-0 group-hover:opacity-100 self-center transition-opacity" />
              </button>
            ))}
          </div>
          
          <div className="p-3 bg-gray-900/50 border-t border-gray-800 text-center">
             <button className="text-[10px] text-blue-400 hover:text-blue-300 font-medium hover:underline">
               Ver documentación técnica
             </button>
          </div>
        </div>
      )}
    </div>
  );
}


