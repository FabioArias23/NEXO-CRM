import {
  ArrowLeft,
  CheckCircle,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import usersMockData from "../data/mocks/users.json";

export function AdminUserManagement() {
  const navigate = useNavigate();
  const [users] = useState(usersMockData.users);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {}
      <div className="h-14 sm:h-16 border-b border-gray-900 bg-black sticky top-0 z-10">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-900 rounded-lg transition-colors text-gray-400 hover:text-white flex-shrink-0"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
              <h1 className="text-sm sm:text-lg font-bold truncate">
                NEXO ADMIN
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="h-6 w-px bg-gray-800"></div>
              <p className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                Gestión de Equipo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-32 lg:w-48"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-black px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
              aria-label="Invitar usuario"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Invitar</span>
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              Usuarios del Sistema
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Controla quién tiene acceso a la plataforma y sus niveles de
              permiso.
            </p>
          </div>

          {}
          <div className="relative sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {}
          <div className="hidden lg:block border border-gray-800 rounded-xl overflow-hidden bg-gray-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900 text-gray-400 font-medium border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider whitespace-nowrap">
                      Usuario
                    </th>
                    <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider whitespace-nowrap">
                      Rol
                    </th>
                    <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider whitespace-nowrap">
                      Estado
                    </th>
                    <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider whitespace-nowrap">
                      Último Acceso
                    </th>
                    <th className="px-6 py-4 text-right font-medium uppercase text-xs tracking-wider whitespace-nowrap">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-900/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-white truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                            user.role === "Super Admin"
                              ? "border-purple-500/30 text-purple-400 bg-purple-500/10"
                              : user.role === "Socio Gerente"
                                ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                : "border-gray-700 text-gray-400 bg-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === "Activo" ? (
                          <div className="inline-flex items-center gap-1.5 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Activo</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-yellow-500 text-xs font-medium bg-yellow-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Pendiente</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Más opciones"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {}
          <div className="lg:hidden space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-gray-950 border border-gray-800 rounded-xl p-4 hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white truncate text-sm">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors flex-shrink-0"
                    aria-label="Más opciones"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.role === "Super Admin"
                        ? "border-purple-500/30 text-purple-400 bg-purple-500/10"
                        : user.role === "Socio Gerente"
                          ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                          : "border-gray-700 text-gray-400 bg-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                  {user.status === "Activo" ? (
                    <div className="inline-flex items-center gap-1.5 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Activo</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-yellow-500 text-xs font-medium bg-yellow-500/10 px-2.5 py-1 rounded-full">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pendiente</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Último acceso:</span>{" "}
                    <span className="font-mono">{user.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gray-950 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-900 flex justify-between items-center gap-4">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Invitar Miembro
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                aria-label="Cerrar modal"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="colaborador@nexo.com"
                  className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Rol
                </label>
                <select
                  className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                  aria-label="Seleccionar rol"
                >
                  <option>Consultor</option>
                  <option>Socio Gerente</option>
                  <option>Auditor</option>
                </select>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-900 bg-gray-900/30 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
                Enviar Invitación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


