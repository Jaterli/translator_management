import React, { useState, useEffect } from 'react';
import { getQueries, deleteQuery } from '../services/api';
import { Link } from 'react-router-dom';
import { Table, Button, Alert, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPlusCircle} from '@fortawesome/free-solid-svg-icons';

function QueryList() {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    async function fetchQueries() {
      const data = await getQueries();
      setQueries(data.queries || []);
    }
    fetchQueries();
  }, []);

  const handleDelete = async (queryId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta consulta?")) {
      const response = await deleteQuery(queryId);
      alert(response.message || 'Consulta eliminada!');
      setQueries(queries.filter(query => query.id !== queryId));
    }
  };

  // Función para formatear las condiciones de la consulta
  const formatQueryConditions = (queryConditions) => {
    return queryConditions.map((condition, index) => (
      <div key={index}>
        {index > 0 && <strong>{condition.logical} </strong>}
        <span>
          {condition.model}.{condition.field} {condition.operator} "{condition.value}"
        </span>
      </div>
    ));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Consultas guardadas</h2>
      {queries.length === 0 ? (
        <Alert variant="info">No hay consultas guardadas.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Consulta</th>
              <th>Fecha de creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {queries.map(query => (
              <tr key={query.id}>
                <td><strong>{query.name}</strong></td>
                <td className="fs-s">
                  {formatQueryConditions(query.query)}
                </td>
                <td>
                  {new Date(query.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>
                  <Link
                    to={`/query_results/${query.id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    <FontAwesomeIcon icon={faEye} /> Mostrar resultados
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(query.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="mt-4 text-center">
        <Link to="/query_form">
          <Button variant="primary" size="lg">
            <FontAwesomeIcon icon={faPlusCircle} /> Crear una consulta
          </Button>
        </Link>
      </div>

    </Container>
  );
}

export default QueryList;