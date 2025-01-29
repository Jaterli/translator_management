import axios from 'axios';


const API_BASE_URL = 'http://localhost:8000/queries/api/';


export async function getFields() {
  const response = await fetch(`${API_BASE_URL}get_fields/`);
  return response.json();
}


export async function saveQuery(data) {
  const response = await fetch(`${API_BASE_URL}save_query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}


export async function getQueries() {
    const response = await axios.get(`${API_BASE_URL}list_queries/`, {mode:'cors'});
    return response.data;
  }
  

export async function deleteQuery(queryId) {
    const response = await axios.delete(`${API_BASE_URL}delete_query/${queryId}`);
    return response.data;
  }


  // Ejecuta consultas en el servicio de API
export async function executeQuery(queryId) {
    const response = await axios.get(`${API_BASE_URL}execute_query/${queryId}/`);
    return response.data;
  }  