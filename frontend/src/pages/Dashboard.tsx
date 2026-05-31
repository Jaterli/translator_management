import React, { useState, useEffect } from 'react';
import { 
  faPlusCircle, 
  faList, 
  faCheckCircle, 
  faUsers, 
  faLanguage, 
  faDatabase,
  faUserCheck,
  faFileAlt,
  faClock,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '/images/logo-TM.png';
import LinkButton from '../components/ui/LinkButton';
import { getQueries, getApprovedCombinations, getDashboardStats } from '../services/api';
import { DashboardStats } from '../types/Types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_translators: 0,
    active_translators: 0,
    total_combinations: 0,
    total_approved_combinations: 0,
    total_saved_queries: 0,
    recent_queries: [],
    popular_language_pairs: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener consultas guardadas
        const queriesResponse = await getQueries();
        const savedQueries = queriesResponse.queries || [];
        
        // Obtener combinaciones homologadas
        const approvedResponse = await getApprovedCombinations();
        const approvedCombinations = approvedResponse.success ? approvedResponse.data : [];
        
        // Obtener estadísticas de traductores y combinaciones desde el backend
        const dashboardStats = await getDashboardStats();
        
        setStats({
          total_translators: dashboardStats.total_translators || 0,
          active_translators: dashboardStats.active_translators || 0,
          total_combinations: dashboardStats.total_combinations || 0,
          total_approved_combinations: approvedCombinations.length,
          total_saved_queries: savedQueries.length,
          recent_queries: savedQueries.slice(0, 5),
          popular_language_pairs: dashboardStats.popular_language_pairs || []
        });
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('No se pudieron cargar algunas estadísticas. Los datos se actualizarán automáticamente.');
        
        // Intentar cargar al menos las consultas guardadas
        try {
          const queriesResponse = await getQueries();
          const savedQueries = queriesResponse.queries || [];
          setStats(prev => ({
            ...prev,
            total_saved_queries: savedQueries.length,
            recent_queries: savedQueries.slice(0, 5)
          }));
        } catch (queryErr) {
          console.error('Error fetching queries:', queryErr);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Traductores Registrados',
      value: stats.total_translators,
      icon: faUsers,
      color: '#4f46e5',
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Traductores Activos',
      value: stats.active_translators,
      icon: faUserCheck,
      color: '#10b981',
      bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Combinaciones de Idiomas',
      value: stats.total_combinations,
      icon: faLanguage,
      color: '#f59e0b',
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Combinaciones Homologadas',
      value: stats.total_approved_combinations,
      icon: faCheckCircle,
      color: '#3b82f6',
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Consultas Guardadas',
      value: stats.total_saved_queries,
      icon: faDatabase,
      color: '#ef4444',
      bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Fila superior: Hero + Estadísticas en dos columnas */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando estadísticas...</p>
        </div>
      ) : (
        <Row className="g-4 mb-4 align-items-stretch">
          {/* Columna izquierda: Hero Section */}
          <Col lg={6} className="d-flex">
            <div className="hero-section p-4 p-md-5 rounded-4 text-center w-100 d-flex flex-column justify-content-center">
              <img 
                src={logo} 
                alt="Logo de Translator Management" 
                className="img-fluid mb-3"
                style={{ maxWidth: '180px', margin: '0 auto' }}
              />
              <h1 className="display-5 fw-bold mb-2">Translator Management</h1>
              <p className="lead mb-0 opacity-90">
                Panel de control y gestión de traductores
              </p>
            </div>
          </Col>

          {/* Columna derecha: Tarjetas de estadísticas apiladas */}
          <Col lg={6}>
            <div className="stats-vertical-stack">
              {statCards.map((card, index) => (
                <Card key={index} className="border-0 shadow-sm stat-card-vertical mb-3">
                  <Card.Body className="d-flex align-items-center">
                    <div 
                      className="stat-icon-vertical me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        background: card.bg,
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        flexShrink: 0
                      }}
                    >
                      <FontAwesomeIcon icon={card.icon} size="lg" style={{ color: 'white' }} />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h5 fw-bold mb-0">{card.value.toLocaleString()}</h3>
                      <p className="text-muted mb-0 small">{card.title}</p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      )}

      {error && (
        <Alert variant="warning" className="mb-4" dismissible>
          <Alert.Heading>⚠️ Atención</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* El resto del contenido se muestra solo si no está cargando */}
      {!loading && (
        <>
          {/* Acciones rápidas */}
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-between my-4">
            <LinkButton 
              to="/query-form" 
              icon={faPlusCircle} 
              variant="primary" 
              size="lg"
              className="flex-grow-1"
            >
              Crear nueva consulta
            </LinkButton>
            
            <LinkButton 
              to="/list-queries" 
              icon={faList} 
              variant="success" 
              size="lg"
              className="flex-grow-1"
            >
              Gestionar consultas
            </LinkButton>
            
            <LinkButton 
              to="/approved-combinations" 
              icon={faCheckCircle} 
              variant="info" 
              size="lg"
              className="flex-grow-1"
            >
              Ver homologaciones
            </LinkButton>
          </div>

          {/* Gráficos y tablas */}
          <Row className="g-4">
            {/* Combinaciones populares */}
            <Col lg={6}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <FontAwesomeIcon icon={faGlobe} className="me-2 text-light" />
                    Combinaciones de idiomas más populares
                  </h5>
                </Card.Header>
                <Card.Body>
                  {stats.popular_language_pairs.length > 0 ? (
                    <div className="popular-pairs">
                      {stats.popular_language_pairs.map((pair, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                          <div>
                            <span className="badge bg-primary me-2">{index + 1}</span>
                            <strong>{pair.pair}</strong>
                          </div>
                          <div>
                            <span className="badge bg-secondary">{pair.count} traductores</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center py-4">
                      No hay datos suficientes para mostrar estadísticas
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Consultas recientes */}
            <Col lg={6}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <FontAwesomeIcon icon={faClock} className="me-2 text-light" />
                    Consultas recientes
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {stats.recent_queries.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {stats.recent_queries.map((query) => (
                        <Link 
                          key={query.id}
                          to={`/query-results/${query.id}`}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <FontAwesomeIcon icon={faFileAlt} className="me-2 text-primary" />
                            <strong>{query.name}</strong>
                          </div>
                          <small className="text-muted">
                            {new Date(query.created_at).toLocaleDateString('es-ES')}
                          </small>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No hay consultas guardadas</p>
                      <LinkButton 
                        to="/query-form" 
                        icon={faPlusCircle} 
                        variant="primary" 
                        size="sm"
                      >
                        Crear primera consulta
                      </LinkButton>
                    </div>
                  )}
                </Card.Body>
                {stats.recent_queries.length > 0 && (
                  <Card.Footer className="border-0 pb-4">
                    <LinkButton 
                      to="/list-queries" 
                      size="sm"
                    >
                      Ver todas las consultas
                    </LinkButton>
                  </Card.Footer>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;