import { useState, useRef, useEffect } from "react";
import { Columns, Check } from "lucide-react";
import type { ColumnConfig } from "../../core/types";

export type { ColumnConfig };

interface ColumnSelectorProps {
  columns: ColumnConfig[];
  onToggle: (key: string) => void;
}

export function ColumnSelector({ columns, onToggle }: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors text-gray-400 hover:text-white whitespace-nowrap"
        title="Columnas"
      >
        <Columns className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">Columnas</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-10">
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-sm text-white">Mostrar Columnas</h3>
            <p className="text-xs text-gray-500 mt-1">
              {columns.filter((c) => c.visible).length} de {columns.length}{" "}
              visibles
            </p>
          </div>
          <div className="p-2 max-h-96 overflow-y-auto">
            {columns.map((column) => (
              <button
                key={column.key}
                onClick={() => onToggle(column.key)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors min-w-0 gap-2"
              >
                <span className="text-sm text-gray-300 truncate flex-1">
                  {column.label}
                </span>
                {column.visible && (
                  <Check className="w-4 h-4 shrink-0 text-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
