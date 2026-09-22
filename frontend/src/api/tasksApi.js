const API_URL = 'http://127.0.0.1:8000/api/tasks';

async function procesarRespuesta(respuesta) {
  const datos = respuesta.status === 204
    ? null
    : await respuesta.json();

  if (!respuesta.ok) {
    const error = new Error(datos?.message || 'Error en la solicitud');
    error.validation = datos?.errors || {};
    throw error;
  }

  return datos;
}

export async function listarTasks() {
  const respuesta = await fetch(API_URL, {
    headers: { Accept: 'application/json' },
  });
  return procesarRespuesta(respuesta);
}

export async function crearTask(task) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  return procesarRespuesta(respuesta);
}


import { useEffect, useState } from 'react';
import { crearTask, listarTasks } from '../services/tasksApi';

const formularioInicial = {
  title: '',
  priority: 'Media',
  completed: false,
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(formularioInicial);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errores, setErrores] = useState({});

  async function cargar() {
    try {
      setCargando(true);
      setErrorGeneral('');
      const datos = await listarTasks();
      setTasks(datos);
    } catch (error) {
      setErrorGeneral(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function cambiarCampo(e) {
    const { name, value, type, checked } = e.target;
    setForm((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorGeneral('');
    setErrores({});

    try {
      await crearTask(form);
      setForm(formularioInicial);
      await cargar();
    } catch (error) {
      setErrorGeneral(error.message);
      setErrores(error.validation || {});
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>TaskEasy - Gestión de Tareas</h1>

      {errorGeneral && <p style={{ color: 'crimson' }}>{errorGeneral}</p>}

      <form onSubmit={guardar} style={{ marginBottom: 30, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
        <div style={{ marginBottom: 15 }}>
          <label><strong>Título de la tarea:</strong></label><br />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={cambiarCampo}
            style={{ width: '100%', padding: 8, marginTop: 5 }}
          />
          {errores.title && <small style={{ color: 'crimson' }}>{errores.title[0]}</small>}
        </div>

        <div style={{ marginBottom: 15 }}>
          <label><strong>Prioridad:</strong></label><br />
          <select
            name="priority"
            value={form.priority}
            onChange={cambiarCampo}
            style={{ width: '100%', padding: 8, marginTop: 5 }}
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        <button type="submit" disabled={guardando} style={{ padding: '10px 15px', background: '#0d9488', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {guardando ? 'Guardando...' : '+ Agregar Tarea'}
        </button>
      </form>

      <hr />
      <h2>Lista de Tareas</h2>

      {cargando ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>No hay tareas registradas.</p>
      ) : (
        <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th>ID</th>
              <th>Título</th>
              <th>Prioridad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.priority}</td>
                <td>{task.completed ? 'Completada' : 'Pendiente'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}