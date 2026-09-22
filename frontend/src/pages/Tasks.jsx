import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Media');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  // Leer datos del usuario logueado
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';

  // Función para cerrar sesión correctamente
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Cargar tareas y usuarios (si es admin)
  const fetchData = async () => {
    try {
      setLoading(true);
      const tasksRes = await api.get('/tasks');
      setTasks(tasksRes.data);

      if (isAdmin) {
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Crear tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.post('/tasks', { title, priority });
      setTitle('');
      setPriority('Media');
      fetchData();
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  // Cambiar estado de completado
  const handleToggleTask = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, { completed: !task.completed });
      fetchData();
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  // Cambiar rol de usuario (Admin)
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchData();
    } catch (error) {
      console.error("Error al cambiar el rol:", error);
      alert("No se pudo actualizar el rol del usuario.");
    }
  };

  // Eliminar / Bloquear usuario (Admin)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario y todas sus tareas asociadas?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert(error.response?.data?.message || "Error al eliminar usuario.");
    }
  };

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2C3E50] flex flex-col justify-between font-sans">
      {/* Navbar Superior limpio y unificado */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#2BA8A8] tracking-wide">TaskEasy</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Hola, {user?.name || 'Usuario'}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
            isAdmin ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isAdmin ? '🛡️ Admin' : '👤 Usuario'}
          </span>
          <button 
            onClick={handleLogout}
            className="text-xs bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-3 py-1.5 rounded-lg transition font-medium border border-gray-200 cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto w-full p-6 my-6 flex-grow">
        
        {/* Pestañas de Navegación Exclusivas para Administradores */}
        {isAdmin && (
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
                activeTab === 'tasks' 
                  ? 'bg-[#2BA8A8] text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              📋 Gestión de Tareas Globales
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-[#2BA8A8] text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              👥 Gestión de Usuarios y Accesos
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'users' ? 'bg-white text-[#2BA8A8]' : 'bg-gray-200 text-gray-700'
              }`}>
                {users.length}
              </span>
            </button>
          </div>
        )}

        {/* VISTA 1: GESTIÓN DE TAREAS */}
        {activeTab === 'tasks' && (
          <>
            {isAdmin ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="font-semibold">Panel de Administrador - Global</p>
                  <p className="text-sm">Estás visualizando todas las tareas del sistema y puedes moderarlas o crear nuevas.</p>
                </div>
              </div>
            ) : (
              <div className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-xl mb-6 shadow-sm flex items-center gap-3">
                <span className="text-xl">👤</span>
                <div>
                  <p className="font-semibold">Panel de Usuario</p>
                  <p className="text-sm">Estás visualizando únicamente tus tareas personales y privadas.</p>
                </div>
              </div>
            )}

            {/* Formulario de Creación */}
<form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-3 mb-6">
  <input
    type="text"
    placeholder="¿Qué tienes pendiente hoy?"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="flex-grow px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BA8A8] bg-white text-gray-800"
  />
  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2BA8A8]"
  >
    <option value="Baja">Baja</option>
    <option value="Media">Media</option>
    <option value="Alta">Alta</option>
  </select>
  <button
    type="submit"
    className="bg-[#2BA8A8] hover:bg-[#238c8c] text-white font-medium px-6 py-2.5 rounded-lg transition shadow-sm cursor-pointer"
  >
    + Agregar
  </button>
</form>

            {/* Lista de Tareas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-semibold text-gray-700 flex justify-between items-center">
                <span>Lista de Tareas</span>
                {isAdmin && <span className="text-xs text-gray-400 font-normal">Supervisión en tiempo real</span>}
              </div>

              {loading ? (
                <p className="p-6 text-center text-gray-500">Cargando tareas...</p>
              ) : tasks.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No hay tareas pendientes en el sistema.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {tasks.map((task) => (
                    <li key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task)}
                          className="w-5 h-5 text-[#2BA8A8] rounded border-gray-300 focus:ring-[#2BA8A8] cursor-pointer"
                        />
                        <div>
                          <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
                            {task.title}
                          </span>
                          {isAdmin && task.user && (
                            <p className="text-xs text-gray-400">Creado por: <span className="font-semibold">{task.user.name}</span> ({task.user.email})</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                          task.priority === 'Alta' ? 'bg-red-100 text-red-600' :
                          task.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                          title="Eliminar tarea"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500 text-right">
              Tienes <span className="font-semibold text-gray-700">{pendingCount}</span> tareas pendientes en esta vista.
            </div>
          </>
        )}

        {/* VISTA 2: GESTIÓN DE USUARIOS Y ACCESOS (SOLO ADMIN) */}
        {isAdmin && activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-semibold text-gray-700 flex justify-between items-center">
              <span>Control de Usuarios Registrados y Estadísticas</span>
              <span className="text-xs text-gray-400 font-normal">Gestión de permisos y accesos</span>
            </div>

            {loading ? (
              <p className="p-6 text-center text-gray-500">Cargando usuarios...</p>
            ) : users.length === 0 ? (
              <p className="p-6 text-center text-gray-500">No hay usuarios registrados en el sistema.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="p-4">Usuario</th>
                      <th className="p-4">Correo Electrónico</th>
                      <th className="p-4 text-center">Tareas Creadas</th>
                      <th className="p-4 text-center">Rol Actual</th>
                      <th className="p-4 text-center">Acciones y Accesos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-800">{u.name}</td>
                        <td className="p-4 text-gray-500">{u.email}</td>
                        <td className="p-4 text-center">
                          <span className="bg-teal-50 text-[#2BA8A8] font-bold px-2.5 py-1 rounded-full text-xs border border-teal-200">
                            {u.tasks_count} tareas
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' :
                            u.role === 'blocked' ? 'bg-gray-200 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-center flex justify-center gap-2 items-center">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-[#2BA8A8] cursor-pointer"
                          >
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                            <option value="blocked">Bloqueado</option>
                          </select>

                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded transition font-medium border border-red-200 cursor-pointer"
                            title="Eliminar usuario del sistema"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        © 2026 TaskEasy - Panel Administrativo Avanzado | Powered by Laravel & React
      </footer>
    </div>
  );
}