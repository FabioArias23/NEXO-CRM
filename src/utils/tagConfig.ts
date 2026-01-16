// Configuración de colores estilo "Nexo Enterprise"
// Usamos Tailwind classes para mantener consistencia
export const TAG_STYLES: Record<string, string> = {
  'Nuevo': 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25',
  'Contactar Luego': 'bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25',
  'Contactado': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/25',
  'Cotizando': 'bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/25',
  'Negociación': 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
  'Cerrado': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
  'Cerrado Ganado': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30',
  'Cerrado Perdido': 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25',
  'default': 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
};

export const getTagStyle = (value: string) => {
  return TAG_STYLES[value] || TAG_STYLES['default'];
};