import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { getTagStyle } from '../../utils/tagConfig'; // Asumiendo que guardaste el paso 1

interface TagSelectorProps {
  value: string;
  options: string[];
  onChange: (newValue: string) => void;
  readOnly?: boolean;
}

export function TagSelector({ value, options, onChange, readOnly = false }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div 
        ref={containerRef} 
        className="relative w-full h-full flex items-center"
        onClick={(e) => e.stopPropagation()} // Vital: evita abrir el Drawer del cliente
    >
      {}
      <div 
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border cursor-pointer transition-all duration-200 select-none w-fit
          ${getTagStyle(value)}
          ${isOpen ? 'ring-2 ring-white/20 scale-105' : ''}
        `}
      >
        <span className="truncate max-w-[120px]">{value || 'Sin Estado'}</span>
        {!readOnly && <ChevronDown className="w-3 h-3 ml-1 opacity-50" />}
      </div>

      {}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left">
          <div className="p-1 max-h-60 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-bold text-gray-500 uppercase px-3 py-2">Seleccionar Estado</p>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                  ${value === option ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}
                `}
              >
                <div className="flex items-center gap-2">
                   {}
                   <div className={`w-2 h-2 rounded-full ${getTagStyle(option).split(' ')[0].replace('/15','').replace('/20','')}`}></div>
                   {option}
                </div>
                {value === option && <Check className="w-3 h-3 text-blue-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


