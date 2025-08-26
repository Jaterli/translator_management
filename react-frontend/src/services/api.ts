import { ApiResponse, AuthResponse, Field, Query, QueryCondition, ResultRow, Translator } from '../types/Types';
import instance from './axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;



// Obtener campos
export async function getModelFields(): Promise<{ fields: Field[] }> {
  const response = await instance.get('/get-fields/');
  return response.data;
}

// Guardar consulta - MODIFICADA para manejar errores
export async function saveQuery(data: { name: string; query: QueryCondition[] }): Promise<ApiResponse<{ id: string }>> {
  try {
    const response = await instance.post('/save-query/', data);
    
    return {
      success: true,
      data: { id: response.data.id },
      message: response.data.message,
    };

  // } catch (error: any) {
  //   const errorMessage = error.response?.data?.error || 'Error al guardar la consulta';
    
  //   return {
  //     success: false,
  //     error: errorMessage, // ← Aquí está el mensaje específico
  //   };
  // }

  } catch (err) {
    let errorMessage = "Error desconocido al guardar la consulta.";
    
    if (err instanceof Error) {
      // Verificamos si es un error de axios con respuesta del servidor
      const axiosError = err as unknown as { response?: { data?: { error?: string } } };
      
      if (axiosError.response?.data?.error) {
        errorMessage = axiosError.response.data.error;
      } else {
        errorMessage = err.message;
      }
    }    
    return {
      success: false,
      error: errorMessage, // ← Aquí está el mensaje específico
    };
  }
}


// Obtener listado de consultas
export async function getQueries(): Promise<ApiResponse<Query[]>> {
  const response = await instance.get('/list-queries/');
  return response.data;
}

// Eliminar consulta
export async function deleteQuery(queryId: string): Promise<ApiResponse<{ id: string }>> {
  const response = await instance.delete(`/delete-query/${queryId}/`);
  return response.data;
}

// Ejecutar consulta
export async function executeQuery(queryId: string): Promise<{
  query: string; results: ResultRow[] 
}> {
  const response = await instance.get(`/execute-query/${queryId}/`);
  return response.data;
}

// Autenticación (login)
export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await instance.post<AuthResponse>(`${API_BASE_URL}/auth/login/`, { username, password });
  return response.data;
}

import axios from 'axios';

// Vista detalle de traductor
export async function getTranslatorDetail(id: string): Promise<Translator> {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No estás autenticado. Por favor, inicia sesión.');
  }

  const response = await axios.get(`${API_BASE_URL}/translator-detail/${id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}
