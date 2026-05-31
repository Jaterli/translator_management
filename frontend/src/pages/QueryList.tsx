import React, { useState, useEffect, useMemo } from 'react';
import { getQueries, deleteQuery } from '../services/api';
import { Link } from 'react-router-dom';
import { Table, Button, Alert, Card, Form, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTrash, 
    faEye, 
    faPlusCircle, 
    faSearch, 
    faTimes, 
    faSave,
    faCalendar
} from '@fortawesome/free-solid-svg-icons';
import LinkButton from '../components/ui/LinkButton';
import { Query, QueryCondition } from '../types/Types';

const QueryList: React.FC = () => {
    const [allQueries, setAllQueries] = useState<Query[]>([]);
    const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Filtros
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');

    useEffect(() => {
        async function fetchQueries() {
            setLoading(true);
            setError(null);
            try {
                const data = await getQueries();
                setAllQueries(data.queries || []);
                setFilteredQueries(data.queries || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar las consultas');
                setAllQueries([]);
                setFilteredQueries([]);
            } finally {
                setLoading(false);
            }
        }
        fetchQueries();
    }, []);

    const handleDelete = async (queryId: string, queryName: string) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar la consulta "${queryName}"?`)) {
            try {
                const response = await deleteQuery(queryId);
                alert(response.message || 'Consulta eliminada correctamente');
                setAllQueries(allQueries.filter(query => query.id !== queryId));
            } catch (err) {
                alert('Error al eliminar la consulta: ' + (err instanceof Error ? err.message : 'Error desconocido'));
            }
        }
    };

    // Función para formatear las condiciones de la consulta
    const formatQueryConditions = (queryConditions: QueryCondition[]) => {
        if (!queryConditions || queryConditions.length === 0) {
            return <span className="text-muted">Sin condiciones</span>;
        }
        
        return queryConditions.map((condition, index) => (
            <div key={index} className="mb-1">
                {index > 0 && <strong className="text-primary me-1">{condition.logical}</strong>}
                <code className="small">
                    {condition.model}.{condition.field} {condition.operator} "{condition.value}"
                </code>
            </div>
        ));
    };

    // Función de búsqueda y filtrado
    const applyFilters = useMemo(() => {
        if (allQueries.length === 0) return [];

        let results = [...allQueries];

        // Búsqueda general por texto
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            results = results.filter(query => {
                return (
                    query.name?.toLowerCase().includes(term) ||
                    JSON.stringify(query.query).toLowerCase().includes(term)
                );
            });
        }

        // Filtro por fecha
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            const filterDateStr = filterDate.toISOString().split('T')[0];
            results = results.filter(query => {
                const queryDate = new Date(query.created_at).toISOString().split('T')[0];
                return queryDate === filterDateStr;
            });
        }

        return results;
    }, [allQueries, searchTerm, dateFilter]);

    // Actualizar resultados filtrados cuando cambian los filtros
    useEffect(() => {
        setFilteredQueries(applyFilters);
    }, [applyFilters]);

    const handleReset = () => {
        setSearchTerm('');
        setDateFilter('');
    };

    return (
        <div className="mt-4">
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h2 className="h4 mb-0">
                            <FontAwesomeIcon icon={faSave} className="me-2" />
                            Consultas Guardadas
                        </h2>
                        <div className="d-flex gap-2">
                            <Badge bg="light" text="dark" className="fs-6">
                                Mostrando: {filteredQueries.length} / {allQueries.length}
                            </Badge>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {/* Fila 1: Buscador general */}
                    <Row className="mb-3">
                        <Col xs={12}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por nombre de consulta o condiciones..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                )}
                            </InputGroup>
                        </Col>
                    </Row>

                    {/* Tabla de resultados */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2 text-muted">Cargando consultas guardadas...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">
                            <Alert.Heading>Error</Alert.Heading>
                            <p>{error}</p>
                        </Alert>
                    ) : filteredQueries.length === 0 ? (
                        <Alert variant="info">
                            <Alert.Heading>No hay consultas</Alert.Heading>
                            <p>
                                {allQueries.length === 0 
                                    ? 'Aún no has guardado ninguna consulta. ¡Crea tu primera consulta haciendo clic en el botón "Crear consulta"!'
                                    : 'No se encontraron consultas con los criterios de búsqueda seleccionados.'
                                }
                            </p>
                            {(searchTerm || dateFilter) && (
                                <Button variant="outline-info" size="sm" onClick={handleReset}>
                                    Limpiar filtros
                                </Button>
                            )}
                        </Alert>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead className="table-dark">
                                    <tr>
                                        <th>Nombre</th>
                                        <th className="d-none d-md-table-cell">Condiciones</th>
                                        <th>Fecha de creación</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQueries.map((query) => (
                                        <tr key={query.id}>
                                            <td>
                                                <strong>{query.name}</strong>
                                            </td>
                                            <td className="d-none d-md-table-cell">
                                                {formatQueryConditions(query.query)}
                                            </td>
                                            <td>
                                                <div className="text-nowrap">
                                                    <FontAwesomeIcon icon={faCalendar} className="me-1 text-muted" />
                                                    {new Date(query.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                    })}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Link
                                                        to={`/query-results/${query.id}`}
                                                        className="btn btn-sm btn-primary"
                                                        title="Ejecutar consulta"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                        <span className="d-none d-lg-inline-flex ms-1">Ejecutar</span>
                                                    </Link>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(query.id, query.name)}
                                                        title="Eliminar consulta"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                        <span className="d-none d-lg-inline-flex ms-1">Eliminar</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Botón para crear nueva consulta */}
            {!loading && (
                <div className="text-center">
                    <LinkButton to="/query-form" icon={faPlusCircle} variant="primary" size="lg">
                        Crear una consulta
                    </LinkButton>
                </div>
            )}
        </div>
    );
};

export default QueryList;