import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importar FontAwesome
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importar el icono de logout

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Logo y texto */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src="/images/logo-gc.png" 
            alt="Logo" 
            height="40" 
            className="d-inline-block align-top"
          />
          <span className="ms-2">Gestor de consultas</span>
        </Link>

        {/* Botón de toggle para dispositivos móviles */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Mostrar enlaces y detalles del usuario si está autenticado */}
            {isAuthenticated && user && (
              <>          
                <li className="nav-item">
                  <Link className="nav-link" to="/list-queries">Consultas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/query-results">Resultados</Link>
                </li>
                <li className="nav-item">
                  <div className="nav-link text-info">
                    <span className="me-2">{user.name}</span>
                    <span>({user.email})</span>
                  </div>
                </li>
              </>
            )}

            {/* Botón de login/logout */}
            <li className="nav-item ms-2 d-flex align-items-center">
              {isAuthenticated ? (
                <button 
                  onClick={logout} 
                  className="btn btn-outline-light btn-sm"
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Salir{/* Icono de logout */}
                </button>
              ) : (
                <Link to="/login" className="btn btn-outline-light btn-sm" aria-label="Iniciar sesión">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;