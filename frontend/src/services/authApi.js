const API_URL = 'http://127.0.0.1:8000/api';

export async function registrarUsuario(datos) {
  const respuesta = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  const json = await respuesta.json();
  if (!respuesta.ok) {
    const error = new Error(json.message || 'Error en el registro');
    error.validation = json.errors || {};
    throw error;
  }
  return json;
}

export async function loginUsuario(datos) {
  const respuesta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  const json = await respuesta.json();
  if (!respuesta.ok) {
    const error = new Error(json.message || 'Error al iniciar sesión');
    error.validation = json.errors || {};
    throw error;
  }
  return json;
}