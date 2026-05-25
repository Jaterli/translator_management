import React, { useState, useEffect } from 'react';
import { getQueries, deleteQuery } from '../services/api';
import { Link } from 'react-router-dom';
import { Table, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import LinkButton from '../components/ui/LinkButton';
import { Query, QueryCondition } from '../types/Types';

// Definición de tipos

const QueryList: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);

  useEffect(() => {
    async function fetchQueries() {
      const data = await getQueries();
      setQueries(data.queries || []);
    }
    fetchQueries();
  }, []);

  const handleDelete = async (queryId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta consulta?")) {
      const response = await deleteQuery(queryId);
      alert(response.message || 'Consulta eliminada!');
      setQueries(queries.filter(query => query.id !== queryId));
    }
  };

  // Función para formatear las condiciones de la consulta
  const formatQueryConditions = (queryConditions: QueryCondition[]) => {
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
    <section className="mt-4">
      <h1 className="mb-4 text-center">Consultas guardadas</h1>
      {queries.length === 0 ? (
        <Alert variant="info">No hay consultas guardadas.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="d-none d-md-table-cell">Consulta</th>{/* Oculta en móviles */}
                <th>Fecha de creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {queries.map(query => (
                <tr key={query.id}>
                  <td><strong>{query.name}</strong></td>
                  <td className="d-none d-md-table-cell fs-custom-7">{/* Oculta en móviles */}
                    {formatQueryConditions(query.query)}
                  </td>
                  <td>
                    {new Date(query.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                  <td>
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <Link
                        to={`/query-results/${query.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        <FontAwesomeIcon icon={faEye} /> <span className='d-none d-lg-inline-flex'>Ejecutar</span>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(query.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> <span className='d-none d-lg-inline-flex'>Eliminar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <div className="mt-4 text-center">

      <LinkButton to="/query-form" icon={faPlusCircle} variant="primary" size="lg">
        Crear una consulta
      </LinkButton>

      </div>
    </section>
  );
};

export default QueryList;