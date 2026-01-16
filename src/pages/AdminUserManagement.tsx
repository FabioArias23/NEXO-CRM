import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, Search, Plus, MoreHorizontal, Mail, CheckCircle, Lock, XCircle } from 'lucide-react';

// Datos Mock (Simulados)
const MOCK_USERS = [
  { id: '1', name: 'Martin Fernandez', email: 'martin@nexo.com', role: 'Super Admin', status: 'Activo', lastActive: 'Ahora' },
  { id: '2', name: 'Laura Gómez', email: 'laura@nexo.com', role: 'Socio Gerente', status: 'Activo', lastActive: 'Hace 1h' },
  { id: '3', name: 'Carlos Ruiz', email: 'carlos@nexo.com', role: 'Consultor', status: 'Pendiente', lastActive: '-' },
];

export function AdminUserManagement() {
  const navigate = useNavigate();
  const [users] = useState(MOCK_USERS);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Admin */}
      <div className="h-16 border-b border-gray-900 flex items-center justify-between px-8 bg-black sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-900 rounded-full transition-colors text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" /> NEXO ADMIN
            </h1>
          </div>
          <div className="h-6 w-px bg-gray-800 mx-2"></div>
          <p className="text-sm text-gray-400">Gestión de Equipo</p>
        </div>
        <div className="flex gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Buscar..." className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <button onClick={() => setShowModal(true)} className="bg-white text-black px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Invitar
            </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-8 max-w-6xl mx-auto w-full">
          <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Usuarios del Sistema</h2>
              <p className="text-gray-500">Controla quién tiene acceso a la plataforma y sus niveles de permiso.</p>
          </div>

          <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-950">
            <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-gray-400 font-medium border-b border-gray-800">
                <tr>
                <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Usuario</th>
                <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Rol</th>
                <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Estado</th>
                <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Último Acceso</th>
                <th className="px-6 py-4 text-right font-medium uppercase text-xs tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-900/50 transition-colors group">
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                        </div>
                        <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                        </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        user.role === 'Super Admin' 
                        ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' 
                        : user.role === 'Socio Gerente'
                        ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                        : 'border-gray-700 text-gray-400 bg-gray-800'
                    }`}>
                        {user.role}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                        {user.status === 'Activo' ? (
                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded w-fit">
                                <CheckCircle className="w-3 h-3" /> Activo
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-yellow-500 text-xs font-medium bg-yellow-500/10 px-2 py-1 rounded w-fit">
                                <Lock className="w-3 h-3" /> Pendiente
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {user.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* Modal Invitación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-gray-950 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-900 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Invitar Miembro</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><XCircle className="w-5 h-5"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                        <input type="email" placeholder="colaborador@nexo.com" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rol</label>
                        <select className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:outline-none">
                            <option>Consultor</option>
                            <option>Socio Gerente</option>
                            <option>Auditor</option>
                        </select>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-900 bg-gray-900/30 flex justify-end gap-3">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium">Cancelar</button>
                    <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200">Enviar Invitación</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}