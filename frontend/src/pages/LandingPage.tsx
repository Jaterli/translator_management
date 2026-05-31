// pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSave, 
  faChartLine, 
  faDatabase, 
  faArrowRight, 
  faCheckCircle,
  faUsers,
  faShieldAlt,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import logo from '/images/logo-gc.png';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: faSearch,
      title: 'Consultas Inteligentes',
      description: 'Crea consultas personalizadas con una interfaz intuitiva, sin necesidad de escribir SQL complejo.',
      color: '#4f46e5'
    },
    {
      icon: faSave,
      title: 'Guardado de Consultas',
      description: 'Almacena tus consultas favoritas y accede a ellas cuando las necesites con un solo clic.',
      color: '#10b981'
    },
    {
      icon: faChartLine,
      title: 'Ejecución Rápida',
      description: 'Ejecuta tus consultas y visualiza los resultados de forma clara y organizada.',
      color: '#f59e0b'
    },
    {
      icon: faDatabase,
      title: 'Múltiples Modelos',
      description: 'Accede a datos de traductores, perfiles profesionales y combinaciones de idiomas.',
      color: '#ef4444'
    }
  ];

  const benefits = [
    'Ahorra tiempo con consultas predefinidas',
    'Interfaz amigable sin conocimientos técnicos',
    'Resultados en tiempo real',
    'Filtros avanzados por múltiples criterios',
    'Exportación de datos organizada',
    'Seguridad y control de acceso'
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section text-center py-5 py-md-6">
        <div className="container-xxl">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <img 
                src={logo} 
                alt="Gestor de Consultas" 
                className="hero-logo mb-4"
                style={{ maxHeight: '120px' }}
              />
              <h1 className="display-4 fw-bold mb-4">
                Gestor de Consultas para{' '}
                <span>Traductores</span>
              </h1>
              <p className="lead fs-4 mb-4 text-muted">
                La herramienta definitiva para administrar, filtrar y analizar 
                tu base de datos de traductores de manera fácil y eficiente.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/login" className="btn btn-primary btn-lg px-4 py-3">
                  Comenzar ahora
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Link>
                <a href="#features" className="btn btn-outline-secondary btn-lg px-4 py-3">
                  Descubrir más
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-body-tertiary">
        <div className="container-xxl">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-number">3+</div>
                <div className="stat-label">Modelos de datos</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-number">20+</div>
                <div className="stat-label">Campos disponibles</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Personalizable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-5 py-md-6">
        <div className="container-xxl">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              ¿Qué puedes hacer?
            </h2>
            <p className="lead text-muted">
              Descubre todas las funcionalidades que te ofrece nuestra plataforma
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="feature-card h-100 text-center p-4">
                  <div 
                    className="feature-icon mx-auto mb-4"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <FontAwesomeIcon 
                      icon={feature.icon} 
                      style={{ color: feature.color }}
                      size="2x"
                    />
                  </div>
                  <h3 className="h5 fw-bold mb-3">{feature.title}</h3>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works py-5 py-md-6 bg-body-tertiary">
        <div className="container-xxl">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              ¿Cómo funciona?
            </h2>
            <p className="lead text-muted">
              En tres simples pasos podrás gestionar tus consultas
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number mx-auto mb-3">1</div>
                <h3 className="h5 fw-bold mb-3">Crea tu consulta</h3>
                <p className="text-muted">
                  Selecciona los campos, operadores y valores que deseas filtrar
                  usando nuestra interfaz intuitiva.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number mx-auto mb-3">2</div>
                <h3 className="h5 fw-bold mb-3">Guarda la consulta</h3>
                <p className="text-muted">
                  Dale un nombre descriptivo y guárdala para usarla en el futuro
                  sin tener que volver a crearla.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number mx-auto mb-3">3</div>
                <h3 className="h5 fw-bold mb-3">Ejecuta y analiza</h3>
                <p className="text-muted">
                  Ejecuta tu consulta y visualiza los resultados de manera clara,
                  con acceso directo a los detalles de cada traductor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-5 py-md-6">
        <div className="container-xxl">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">
                Beneficios exclusivos
              </h2>
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item mb-3 d-flex align-items-center">
                    <FontAwesomeIcon 
                      icon={faCheckCircle} 
                      className="text-success me-3"
                      style={{ fontSize: '1.25rem' }}
                    />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="benefits-card p-4 bg-body-tertiary rounded-4">
                <div className="d-flex align-items-start mb-4">
                  <div className="benefits-icon me-3">
                    <FontAwesomeIcon icon={faShieldAlt} size="2x" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="h5 fw-bold mb-2">Seguro y confiable</h3>
                    <p className="text-muted mb-0">
                      Autenticación JWT, roles de usuario y datos protegidos
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-4">
                  <div className="benefits-icon me-3">
                    <FontAwesomeIcon icon={faUsers} size="2x" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="h5 fw-bold mb-2">Diseñado para equipos</h3>
                    <p className="text-muted mb-0">
                      Perfecto para administradores que gestionan bases de datos
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="benefits-icon me-3">
                    <FontAwesomeIcon icon={faRocket} size="2x" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="h5 fw-bold mb-2">Rápido y eficiente</h3>
                    <p className="text-muted mb-0">
                      Resultados instantáneos con una interfaz responsiva
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 py-md-6 bg-primary text-white">
        <div className="container-xxl text-center">
          <h2 className="display-5 fw-bold mb-4">
            ¿Listo para optimizar tu gestión?
          </h2>
          <p className="lead mb-4 opacity-90">
            Únete a los administradores que ya confían en nuestra plataforma
          </p>
          <Link to="/login" className="btn btn-light btn-lg px-5 py-3">
            Iniciar sesión
            <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;