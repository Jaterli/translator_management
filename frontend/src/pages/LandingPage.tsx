// pages/LandingPage.tsx
import React from 'react';
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
  faRocket,
  faUserPlus,
  faUserCog,
  faLanguage,
  faClipboardList,
  faCertificate
} from '@fortawesome/free-solid-svg-icons';
import logo from '/images/logo-TM.png';
import LinkButton from '../components/ui/LinkButton';
import { Button } from 'react-bootstrap';

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
    'Homologación de combinaciones de idiomas',
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
                alt="Translator Management" 
                className="hero-logo mb-4"
                style={{ maxHeight: '120px' }}
              />
              <h1 className="display-4 fw-bold mb-4">
                Translator Management
              </h1>
              <p className="lead fs-4 mb-4 text-muted">
                Plataforma integral para la gestión de traductores. Los traductores gestionan su perfil profesional,
                mientras los administradores realizan consultas avanzadas y homologan combinaciones de idiomas.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <a href="#translator-section" className="btn btn-primary btn-lg px-4 py-3">
                  Soy Traductor
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </a>
                <a href="#admin-section" className="btn btn-secondary btn-lg px-4 py-3">
                  Soy Administrador
                  <FontAwesomeIcon icon={faUserCog} className="ms-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Roles Section - Versión Genérica */}
      <section className="roles-section py-5 py-md-6">
        <div className="container-xxl">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              Dos partes, múltiples posibilidades
            </h2>
            <p className="lead text-muted">
              La plataforma es fácilmente adaptable a cualquier escenario donde se necesite gestionar y consultar perfiles
            </p>
          </div>
          <div className="row g-4">
            {/* Colectivos a gestionar (Proveedores, clientes, alumnos, etc.) */}
            <div className="col-md-6">
              <div className="stat-card h-100 p-4">
                <div className="text-center mb-4">
                  <div className="feature-icon mx-auto mb-3" style={{ backgroundColor: '#10b98115' }}>
                    <FontAwesomeIcon icon={faUsers} size="2x" style={{ color: '#10b981' }} />
                  </div>
                  <h3 className="h3 fw-bold mb-2">Para cualquier colectivo</h3>
                  <p className="text-muted">Proveedores, clientes, alumnos, personal interno...</p>
                </div>
                <div className="benefits-list">
                  <div className="benefit-item mb-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Gestión completa de perfiles y datos personales</span>
                  </div>
                  <div className="benefit-item mb-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Campos personalizables según el tipo de colectivo</span>
                  </div>
                  <div className="benefit-item mb-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Adjuntar documentación relevante (CVs, certificados, etc.)</span>
                  </div>
                  <div className="benefit-item mb-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Registro de relaciones, historial o categorías específicas</span>
                  </div>
                  <div className="benefit-item d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Autogestión de cuenta y datos por cada usuario</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Administradores de la base de datos */}
            <div className="col-md-6">
              <div className="stat-card h-100 p-4">
                <div className="text-center mb-4">
                  <div className="feature-icon mx-auto mb-3" style={{ backgroundColor: '#4f46e515' }}>
                    <FontAwesomeIcon icon={faDatabase} size="2x" style={{ color: '#4f46e5' }} />
                  </div>
                  <h3 className="h3 fw-bold mb-2">Para administradores de datos</h3>
                  <p className="text-muted">Consultas complejas, filtros y homologación de información</p>
                </div>
                <div className="benefits-list">
                  <div className="benefit-item mb-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Consultas avanzadas con múltiples filtros personalizados</span>
                  </div>
                  <div className="benefit-item mb-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Guardado y reutilización de consultas complejas</span>
                  </div>
                  <div className="benefit-item mb-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Vista detallada de cada perfil gestionado</span>
                  </div>
                  <div className="benefit-item mb-2 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCertificate} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Homologación o validación de datos y categorías</span>
                  </div>
                  <div className="benefit-item d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3" style={{ fontSize: '1rem' }} />
                    <span>Extracción de datos para informes o tomas de decisión</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nota de adaptabilidad */}
          <div className="text-center mt-4">
            <p className="text-muted">
              <FontAwesomeIcon icon={faRocket} className="me-1" /> 
              Esta estructura se adapta fácilmente a cualquier necesidad empresarial: gestión de proveedores, alumnos, clientes, personal interno...
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - Translator */}
      <section id="translator-section" className="how-it-works py-5 py-md-6">
        <div className="container-xxl">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              <FontAwesomeIcon icon={faUserPlus} className="me-2" style={{ color: '#10b981' }} />
              Caso concreto: Traductores
            </h2>
            <p className="lead text-muted">
              En cuatro pasos tendrás tu perfil profesional listo
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="stat-card text-center">
                <div className="step-number mx-auto mb-3">1</div>
                <h3 className="h5 fw-bold mb-3">Regístrate</h3>
                <p className="text-muted">
                  Crea tu cuenta como traductor con tus datos básicos.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card text-center">
                <div className="step-number mx-auto mb-3">2</div>
                <h3 className="h5 fw-bold mb-3">Completa tu perfil</h3>
                <p className="text-muted">
                  Añade tu educación, experiencia y software que dominas.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card text-center">
                <div className="step-number mx-auto mb-3">3</div>
                <h3 className="h5 fw-bold mb-3">Añade combinaciones</h3>
                <p className="text-muted">
                  Configura tus pares de idiomas y precios por palabra/hora.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card text-center">
                <div className="step-number mx-auto mb-3">4</div>
                <h3 className="h5 fw-bold mb-3">Sube tus archivos</h3>
                <p className="text-muted">
                  Adjunta tu CV y nota de voz (para intérpretes/dobladores).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Admin */}
      <section id="admin-section" className="features-section py-5 py-md-6 bg-body-tertiary">
        <div className="container-xxl">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              <FontAwesomeIcon icon={faUserCog} className="me-2" style={{ color: '#4f46e5' }} />
              Para administradores
            </h2>

            <p className="lead text-muted">
              Gestiona y consulta la base de datos de traductores
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="stat-card h-100 text-center p-4">
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

      {/* Versatility Section */}
      <section className="versatility-section py-5 py-md-6">
        <div className="container-xxl">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">
                ¿Para qué empresas?
              </h2>
              <p className="lead mb-4">
                Esta plataforma es un <strong>desarrollo proyecto</strong> que puede ser adaptado y ofrecido a:
              </p>
              <div className="benefits-list mb-4">
                <div className="benefit-item mb-3 d-flex align-items-center">
                  <FontAwesomeIcon icon={faLanguage} className="text-primary me-3" style={{ fontSize: '1.25rem' }} />
                  <span><strong>Empresas de traducción</strong> - Gestión de traductores freelance</span>
                </div>
                <div className="benefit-item mb-3 d-flex align-items-center">
                  <FontAwesomeIcon icon={faUsers} className="text-primary me-3" style={{ fontSize: '1.25rem' }} />
                  <span><strong>Centros de formación</strong> - Gestión de alumnos y consultas avanzadas</span>
                </div>
                <div className="benefit-item mb-3 d-flex align-items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="text-primary me-3" style={{ fontSize: '1.25rem' }} />
                  <span><strong>Empresas en general</strong> - Gestión de clientes, proveedores o personal</span>
                </div>
              </div>
              <p className="text-muted">
                La plataforma ofrece <strong>gran versatilidad</strong> y se puede ajustar a múltiples casos de forma rápida y efectiva,
                adaptándose a las necesidades específicas de cada empresa.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="stat-card p-4">
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
                    <FontAwesomeIcon icon={faRocket} size="2x" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="h5 fw-bold mb-2">Rápido y eficiente</h3>
                    <p className="text-muted mb-0">
                      Resultados instantáneos con una interfaz responsiva
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="benefits-icon me-3">
                    <FontAwesomeIcon icon={faSave} size="2x" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="h5 fw-bold mb-2">Fácil de adaptar</h3>
                    <p className="text-muted mb-0">
                      Código modular y documentado para personalización rápida
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-5 py-md-6 bg-body-tertiary">
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
              <div className="stat-card p-4">
                <h3 className="h4 fw-bold mb-4 text-center">¿Quieres probarlo?</h3>
                <p className="text-center mb-4">
                  Accede como traductor para crear tu perfil o como administrador para gestionar la base de datos.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Button onClick={() => {
                    window.location.href = '/translators';
                    }} variant="primary" size="lg">
                    <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                    Soy Traductor
                  </Button> 
                  <LinkButton to="/login" variant="btn btn-secondary" size="lg">
                    <FontAwesomeIcon icon={faUserCog} className="me-2" />
                    Soy Administrador
                  </LinkButton>
                </div>
                <p className="text-center text-muted mt-3 small">
                  Los administradores pueden solicitar credenciales de acceso
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 py-md-6 text-white">
        <div className="container-xxl text-center">
          <h2 className="display-5 fw-bold mb-4">
           ¿Necesitas una solución para gestionar y consultar perfiles de forma avanzada? 
          </h2>
          <p className="lead mb-4 opacity-90">
            Prueba esta demo y descubre cómo puede adaptarse a tus necesidades.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Button onClick={() => {
              window.location.href = '/translators';
              }} variant="light" size="lg">
              Acceso Traductores
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Button>
            <LinkButton to="/login" variant="outline-light" size="lg">
              Acceso Administradores
              <FontAwesomeIcon icon={faUserCog} className="ms-2" />
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;