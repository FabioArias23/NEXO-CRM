import { useState, useRef, useEffect } from 'react';
import { Filter, X, Plus } from 'lucide-react';

export interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AdvancedFiltersProps {
  onApply: (filters: FilterRule[]) => void;
  onClear: () => void;
}

const fields = [
  { value: 'name', label: 'Nombre' },
  { value: 'company', label: 'Empresa' },
  { value: 'stage', label: 'Etapa' },
  { value: 'value', label: 'Valor' },
  { value: 'probability', label: 'Probabilidad' },
  { value: 'contact', label: 'Contacto' },
  { value: 'ownerName', label: 'Propietario' },
];

const operators = [
  { value: 'contains', label: 'Contiene' },
  { value: 'equals', label: 'Igual a' },
  { value: 'greater', label: 'Mayor que' },
  { value: 'less', label: 'Menor que' },
];

export function AdvancedFilters({ onApply, onClear }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        id: Math.random().toString(),
        field: 'name',
        operator: 'contains',
        value: '',
      },
    ]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<FilterRule>) => {
    setFilters(filters.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleApply = () => {
    onApply(filters.filter(f => f.value));
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters([]);
    onClear();
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
          filters.length > 0
            ? 'border-white bg-white text-black'
            : 'border-gray-800 hover:bg-gray-900 text-gray-400 hover:text-white'
        }`}
        title="Filtros Avanzados"
      >
        <Filter className="w-5 h-5" />
        {filters.length > 0 && (
          <span className="text-xs">{filters.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-10">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm text-white">Filtros Avanzados</h3>
            {filters.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Limpiar todo
              </button>
            )}
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {filters.map((filter, index) => (
              <div
                key={filter.id}
                className="bg-black border border-gray-800 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Filtro {index + 1}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-white focus:outline-none focus:border-gray-600"
                >
                  {fields.map(field => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-white focus:outline-none focus:border-gray-600"
                >
                  {operators.map(op => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  placeholder="Valor..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>
            ))}

            <button
              onClick={addFilter}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Agregar Filtro</span>
            </button>
          </div>

          <div className="px-4 py-3 border-t border-gray-800 flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Aplicar
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
