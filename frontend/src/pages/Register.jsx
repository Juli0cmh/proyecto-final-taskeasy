import { useState } from 'react';
import { registrarUsuario } from '../services/authApi';

export default function Register({ alRegistrarExitoso }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  function cambiarCampo(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviarRegistro(e) {
    e.preventDefault();
    setCargando(true);
    setErrorGeneral('');

    try {
      const respuesta = await registrarUsuario(form);
      // Guardamos el token de Sanctum en localStorage
      localStorage.setItem('token', respuesta.access_token);
      localStorage.setItem('user', JSON.stringify(respuesta.user));
      alert('¡Registro exitoso!');
      if (alRegistrarExitoso) alRegistrarExitoso();
    } catch (error) {
      setErrorGeneral(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, background: '#f9f9f9', borderRadius: 8, fontFamily: 'sans-serif' }}>
      <h2>Crear Cuenta - TaskEasy</h2>
      {errorGeneral && <p style={{ color: 'crimson' }}>{errorGeneral}</p>}

      <form onSubmit={enviarRegistro}>
        <div style={{ marginBottom: 15 }}>
          <label>Nombre:</label><br />
          <input type="text" name="name" value={form.name} onChange={cambiarCampo} style={{ width: '100%', padding: 8 }} required />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Correo Electrónico:</label><br />
          <input type="email" name="email" value={form.email} onChange={cambiarCampo} style={{ width: '100%', padding: 8 }} required />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Contraseña:</label><br />
          <input type="password" name="password" value={form.password} onChange={cambiarCampo} style={{ width: '100%', padding: 8 }} required />
        </div>

        <button type="submit" disabled={cargando} style={{ width: '100%', padding: 10, background: '#0d9488', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}