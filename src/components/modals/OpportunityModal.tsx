import { useState } from 'react';
import { X, Trash2, Loader2, User, Clock, AlertTriangle } from 'lucide-react';
import { useOpportunities, Opportunity } from '../../hooks/useOpportunities';

interface OpportunityModalProps {
  opportunity?: Opportunity;
  onClose: () => void;
}

const stages = [
  'Prospecto',
  'Calificado',
  'Propuesta',
  'Negociación',
  'Cerrado Ganado',
  'Cerrado Perdido'
];

export function OpportunityModal({ opportunity, onClose }: OpportunityModalProps) {
  const { createOpportunity, updateOpportunity, deleteOpportunity } = useOpportunities();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: opportunity?.name || '',
    company: opportunity?.company || '',
    contact: opportunity?.contact || '',
    value: opportunity?.value || 0,
    stage: opportunity?.stage || 'Prospecto',
    probability: opportunity?.probability || 30,
    closeDate: opportunity?.closeDate || new Date().toISOString().split('T')[0],
    description: opportunity?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (opportunity) {
        await updateOpportunity(opportunity.id, formData);
      } else {
        await createOpportunity(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!opportunity) return;
    
    setLoading(true);
    try {
      await deleteOpportunity(opportunity.id);
      onClose();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-900">
          <h2 className="text-xl text-white">
            {opportunity ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Nombre de la Oportunidad *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  placeholder="Ej: Servicio Premium Anual"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Empresa *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  placeholder="Nombre de la empresa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Contacto Principal *
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  placeholder="Nombre del contacto"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Valor Monetario (USD) *
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Etapa del Pipeline *
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
                  required
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Probabilidad de Cierre (%)
                </label>
                <input
                  type="number"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Fecha de Cierre Estimada
                </label>
                <input
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Descripción / Notas
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none"
                  rows={3}
                  placeholder="Información adicional sobre la oportunidad..."
                />
              </div>
            </div>

            {opportunity && (
              <div className="pt-6 border-t border-gray-900">
                <h3 className="text-sm text-gray-400 mb-4">Información de Auditoría</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-black rounded-lg border border-gray-900">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Propietario Original</p>
                      <p className="text-sm text-white">{opportunity.ownerName}</p>
                      <p className="text-xs text-gray-600">{opportunity.ownerEmail}</p>
                      <p className="text-xs text-gray-700 mt-1">ID: {opportunity.ownerId.slice(0, 12)}...</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-black rounded-lg border border-gray-900">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Última Modificación</p>
                      <p className="text-sm text-white">{opportunity.lastModifiedByName}</p>
                      <p className="text-xs text-gray-600">{opportunity.lastModifiedByEmail}</p>
                      <p className="text-xs text-gray-600 mt-1">{formatDate(opportunity.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!showDeleteConfirm ? (
            <div className="px-6 py-4 border-t border-gray-900 bg-gray-950 flex items-center justify-between">
              {opportunity && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 border border-red-900 rounded-lg hover:bg-red-950 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Cambios</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 border-t border-red-900 bg-red-950 bg-opacity-50">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white mb-1">¿Confirmar eliminación?</p>
                  <p className="text-xs text-gray-400">
                    Esta acción no se puede deshacer. La oportunidad será eliminada permanentemente.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Confirmar Eliminación</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
