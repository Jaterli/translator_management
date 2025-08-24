import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faTimes, faSun, faMoon} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "../context/ThemeContext.tsx";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Logo y texto */}
        <NavLink 
          className={({ isActive }) => 
            `navbar-brand d-flex align-items-center ${isActive ? 'active' : ''}`
          } 
          to="/"
          end
        >
          <img 
            src="/images/logo-gc.png" 
            alt="Logo" 
            height="40" 
            className="d-inline-block align-top"
          />
          <span className="ms-2 fs-5 fs-md-6">Gestor de consultas</span>
        </NavLink>

        {/* Botón de toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

        {/* Menú de navegación */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated && user && (
              <>          
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    to="/list-queries"
                  >
                    Consultas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    to="/query-results"
                  >
                    Resultados
                  </NavLink>
                </li>
                <li className="nav-item">
                  <div className="text-info">
                    <span className="me-2">{user.name}</span>
                    <span>({user.email})</span>
                  </div>
                </li>
              </>
            )}

            {/* Switch de tema */}
            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm ms-2"
                onClick={toggleTheme}
                aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
                title={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
              </button>
            </li>

            <li className="nav-item d-flex align-items-center">
              {isAuthenticated ? (
                <button 
                  onClick={logout} 
                  className="btn btn-outline-light btn-sm"
                  aria-label="Cerrar sesión"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Salir
                </button>
              ) : (
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `btn btn-outline-light ${isActive ? 'active' : ''}`
                  }
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;