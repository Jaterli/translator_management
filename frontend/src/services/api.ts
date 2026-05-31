import { ApiResponse, ApprovedCombinationsResponse, AuthResponse, AvailableLanguagesResponse, DashboardStats, Field, LanguageCombinationApproval, Query, QueryCondition, ResultRow, Translator } from '../types/Types';
import instance from './axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;


// Obtener campos
export async function getModelFields(): Promise<{ fields: Field[] }> {
  const response = await instance.get(`${API_BASE_URL}/get-fields/`);
  return response.data;
}

// Guardar consulta - MODIFICADA para manejar errores
export async function saveQuery(data: { name: string; query: QueryCondition[] }): Promise<ApiResponse<{ id: string }>> {
  try {
    const response = await instance.post(`${API_BASE_URL}/save-query/`, data);
    
    return {
      success: true,
      data: { id: response.data.id },
      message: response.data.message,
    };

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
      error: errorMessage, 
    };
  }
}


// Obtener listado de consultas
export async function getQueries(): Promise<ApiResponse<Query[]>> {
  const response = await instance.get(`${API_BASE_URL}/list-queries/`);
  return response.data;
}

// Eliminar consulta
export async function deleteQuery(queryId: string): Promise<ApiResponse<{ id: string }>> {
  const response = await instance.delete(`${API_BASE_URL}/delete-query/${queryId}/`);
  return response.data;
}

// Ejecutar consulta
export async function executeQuery(queryId: string): Promise<{
  query: string; results: ResultRow[] 
}> {
  const response = await instance.get(`${API_BASE_URL}/execute-query/${queryId}/`);
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


export async function approveLanguageCombination(translatorId: number, combinationId: number, notes?: string): Promise<ApiResponse<LanguageCombinationApproval>> {
  const response = await instance.post(`${API_BASE_URL}/approve-combination/`, {
    translator_id: translatorId,
    combination_id: combinationId,
    notes: notes || ''
  });
  return response.data;
}


export async function disapproveLanguageCombination(approvalId: number): Promise<ApiResponse<null>> {
  const response = await instance.delete(`${API_BASE_URL}/disapprove-combination/${approvalId}/`);
  return response.data;
}


export async function getApprovedCombinations(translatorId?: number, languagePair?: string): Promise<ApprovedCombinationsResponse> {
    let url = `${API_BASE_URL}/approved-combinations/`;
    const params = new URLSearchParams();
    if (translatorId) params.append('translator_id', translatorId.toString());
    if (languagePair) params.append('language_pair', languagePair);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await instance.get(url);
    return response.data;
}


export async function getAvailableLanguages(): Promise<AvailableLanguagesResponse> {
    const response = await instance.get(`${API_BASE_URL}/available-languages/`);
    return response.data;
}


export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await instance.get(`${API_BASE_URL}/dashboard-stats/`);
  return response.data;
}