// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [vista, setVista] = useState('login'); // 'login' o 'register'

  useEffect(() => {
    const tokenActual = localStorage.getItem('token');
    setToken(tokenActual);
  }, []);

  function actualizarSesion() {
    setToken(localStorage.getItem('token'));
  }

  // Si hay token, renderizamos directamente el componente Tasks (que ya trae su propia barra limpia)
  if (token) {
    return <Tasks />;
  }

  // Si no hay token, mostramos las pantallas de Login o Registro
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans">
      <div className="mb-4 flex gap-4">
        <button 
          onClick={() => setVista('login')} 
          className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${vista === 'login' ? 'bg-[#2BA8A8] text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
        >
          Iniciar Sesión
        </button>
        <button 
          onClick={() => setVista('register')} 
          className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${vista === 'register' ? 'bg-[#2BA8A8] text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
        >
          Registrarse
        </button>
      </div>

      {vista === 'login' ? (
        <Login alIniciarExitoso={actualizarSesion} />
      ) : (
        <Register alRegistrarExitoso={actualizarSesion} />
      )}
    </div>
  );
}