import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faList, faDatabase } from '@fortawesome/free-solid-svg-icons';

function WelcomeSection() {
  return (
    <div className="p-5 bg-light rounded-3 text-center">
      <h1 className="display-4">Gestor de consultas</h1>
      <p className="lead">Administra y guarda tus consultas SQL fácilmente.</p>
      <hr className="my-4" />
      <div className="mt-4">
        <Link to="/query_form">
          <Button variant="primary" size="lg" className="me-3">
            <FontAwesomeIcon icon={faPlusCircle} /> Crear una consulta
          </Button>
        </Link>
        <Link to="/list_queries">
          <Button variant="success" size="lg" className="me-3">
            <FontAwesomeIcon icon={faList} /> Listar consultas
          </Button>
        </Link>
        <Link to="/query_results">
          <Button variant="info" size="lg">
            <FontAwesomeIcon icon={faDatabase} /> Mostrar resultados
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default WelcomeSection;