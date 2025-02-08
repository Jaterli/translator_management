import axios from 'axios';
import instance from './axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  access: string; // Token JWT
  refresh?: string; // Token de refresco (opcional)
  user: { // Información de usuario
    name: string;
    email: string;
  };  
}

// Obtener campos
export async function getFields(): Promise<{ fields: Field[] }> {
  console.log(`${API_BASE_URL}get_fields/`);
  const response = await fetch(`${API_BASE_URL}get_fields/`);
  return response.json();
}

// Guardar consulta
export async function saveQuery(data: { name: string; query: any }): Promise<ApiResponse<Query>> {
  const response = await fetch(`${API_BASE_URL}save_query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Obtener listado de consultas
export async function getQueries(): Promise<ApiResponse<Query[]>> {
  const response = await instance.get(`${API_BASE_URL}list_queries/`);
  return response.data;
}

// Eliminar consulta
export async function deleteQuery(queryId: number): Promise<ApiResponse<{ id: number }>> {
  const response = await axios.delete(`${API_BASE_URL}delete_query/${queryId}`);
  return response.data;
}

// Ejecutar consulta
export async function executeQuery(queryId: string): Promise<ApiResponse<any>> {
  const response = await axios.get(`${API_BASE_URL}execute_query/${queryId}/`);
  return response.data;
}

// Autenticación (login)
export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}auth/login/`, {
    username,
    password,
  });
  return response.data;
}