import instance from './axios';

// Definición de tipos e interfaces
interface Field {
  name: string;
  model: string;
  type: string;
  verbose_name?: string;
  choices?: [string, string][];
}

interface Query {
  id: number;
  name: string;
  query: any; // Define el tipo correcto según la estructura de tu query
}

interface ApiResponse<T> {
  queries: never[];
  data: T;
  message?: string;
  status?: number;
}

// Tipo para la respuesta de autenticación
interface AuthResponse {
  access_token: string; // Token JWT
  refresh_token?: string; // Token de refresco (opcional)
  user: { // Información de usuario
    name: string;
    email: string;
  };  
}

// Obtener campos
export async function getModelFields(): Promise<{ fields: Field[] }> {
  const response = await instance.get('/get_fields/');
  return response.data;
}


// Guardar consulta
export async function saveQuery(data: { name: string; query: any }): Promise<ApiResponse<Query>> {
  const response = await instance.post('/save_query/', data);
  return response.data;
}

// Obtener listado de consultas
export async function getQueries(): Promise<ApiResponse<Query[]>> {
  const response = await instance.get('/list_queries/');
  return response.data;
}

// Eliminar consulta
export async function deleteQuery(queryId: number): Promise<ApiResponse<{ id: number }>> {
  const response = await instance.delete(`/delete_query/${queryId}/`);
  return response.data;
}

// Ejecutar consulta
export async function executeQuery(queryId: string): Promise<ApiResponse<any>> {
  const response = await instance.get(`/execute_query/${queryId}/`);
  return response.data;
}

// Autenticación (login)
export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await instance.post<AuthResponse>('/auth/login/', { username, password });
  return response.data;
}

// Vista detalle de traductor
// export async function getTranslatorDetail(id: string) {
//   const response = await instance.get(`/translators/api/translator_detail/${id}/`);
//   return response.data;
// }


import axios from 'axios';

// Vista detalle de traductor
export async function getTranslatorDetail(id: string) {
  const token = localStorage.getItem('access_token');
  if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
  }

  const response = await axios.get(`http://localhost:8000/translators/api/translator_detail/${id}/`, {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });

  return response.data;
}
