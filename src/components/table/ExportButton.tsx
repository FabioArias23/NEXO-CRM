import { Download } from 'lucide-react';
import { Opportunity } from '../../hooks/useOpportunities';

interface ExportButtonProps {
  opportunities: Opportunity[];
  filename?: string;
}

export function ExportButton({ opportunities, filename = 'opportunities' }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = [
      'Nombre',
      'Valor',
      'Probabilidad',
      'Etapa',
      'Empresa',
      'Contacto',
      'Propietario',
      'Email Propietario',
      'Fecha de Cierre',
      'Creado',
      'Última Modificación',
      'Modificado Por',
    ];

    const rows = opportunities.map(opp => [
      opp.name,
      opp.value,
      opp.probability,
      opp.stage,
      opp.company,
      opp.contact,
      opp.ownerName,
      opp.ownerEmail,
      new Date(opp.closeDate).toLocaleDateString(),
      new Date(opp.createdAt).toLocaleString(),
      new Date(opp.updatedAt).toLocaleString(),
      opp.lastModifiedByName,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors text-gray-400 hover:text-white"
      title="Exportar a CSV"
    >
      <Download className="w-5 h-5" />
      <span className="hidden sm:inline">Exportar</span>
    </button>
  );
}
