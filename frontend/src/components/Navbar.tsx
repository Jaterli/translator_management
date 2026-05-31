import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faBars, 
  faTimes, 
  faSun, 
  faMoon, 
  faHome, 
  faCheckCircle,
  faDatabase,
  faTableList,
  faUserCircle,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "../context/ThemeContext";
import { Dropdown } from 'react-bootstrap';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-xxl">
        {/* Logo y texto */}
        <NavLink 
          className={({ isActive }) => 
            `navbar-brand d-flex align-items-center ${isActive ? 'active' : ''}`
          } 
          to="/"
          end
        >
          <img 
            src="/images/logo-TM.png" 
            alt="Logo" 
            height="40" 
            className="d-inline-block align-top"
          />
          <span className="ms-2 navbar-title">Translator <br />Management</span>
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
                    to="/dashboard"
                  >
                    <FontAwesomeIcon icon={faHome} className="me-2" />
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    to="/list-queries"
                  >
                    <FontAwesomeIcon icon={faDatabase} className="me-2" />
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
                    <FontAwesomeIcon icon={faTableList} className="me-2" />
                    Resultados
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    to="/approved-combinations"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    Homologaciones
                  </NavLink>
                </li>
              </>
            )}

            {/* Switch de tema */}
            <li className="nav-item ms-2">
              <button
                className="btn-sm  theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
                title={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
              </button>
            </li>

            {/* Desplegable de usuario */}
            {isAuthenticated && user ? (
              <li className="nav-item dropdown-user">
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="link" 
                    id="dropdown-user-menu" 
                    className="nav-link dropdown-toggle-custom"
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                    <span className="user-name">{user.name}</span>
                    <FontAwesomeIcon icon={faChevronDown} className="ms-2 dropdown-arrow" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-custom">
                    <div className="dropdown-header">
                      <small className="text-muted">Conectado como</small>
                      <div className="user-email">{user.email}</div>
                    </div>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="dropdown-item-logout">
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `btn btn-outline ${isActive ? 'active' : ''}`
                  }
                >
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>   
    </nav>
  );
};

export default Navbar;