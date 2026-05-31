import React, { useState, useEffect, useMemo } from 'react';
import { 
    Table, 
    Form, 
    Button, 
    Card, 
    Badge, 
    Spinner, 
    Alert,
    Row,
    Col,
    InputGroup
} from 'react-bootstrap';
import { 
    faSearch, 
    faTimes, 
    faCheckCircle,
    faUser,
    faCalendar,
    faDownload,
    faLanguage,
    faFilter,
    faEraser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { getApprovedCombinations, getAvailableLanguages } from '../services/api';
import { LanguageCombinationApproval, Language } from '../types/Types';

const ApprovedCombinations: React.FC = () => {
    const [allApprovals, setAllApprovals] = useState<LanguageCombinationApproval[]>([]);
    const [filteredApprovals, setFilteredApprovals] = useState<LanguageCombinationApproval[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    
    // Idiomas disponibles
    const [sourceLanguages, setSourceLanguages] = useState<Language[]>([]);
    const [targetLanguages, setTargetLanguages] = useState<Language[]>([]);
    const [loadingLanguages, setLoadingLanguages] = useState<boolean>(true);
    
    // Filtros
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sourceLanguage, setSourceLanguage] = useState<string>('');
    const [targetLanguage, setTargetLanguage] = useState<string>('');

    // Cargar idiomas disponibles
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await getAvailableLanguages();
                if (response.success) {
                    setSourceLanguages(response.source_languages);
                    setTargetLanguages(response.target_languages);
                }
            } catch (err) {
                console.error('Error loading languages:', err);
            } finally {
                setLoadingLanguages(false);
            }
        };
        
        fetchLanguages();
    }, []);

    const fetchApprovals = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getApprovedCombinations(undefined, undefined);
            
            if (response.success) {
                setAllApprovals(response.data);
                setTotalCount(response.count);
                setFilteredApprovals(response.data);
            } else {
                setError('Error al cargar las homologaciones');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    // Función de búsqueda y filtrado
    const applyFilters = useMemo(() => {
        if (allApprovals.length === 0) return [];

        let results = [...allApprovals];

        // Filtrar por idioma origen (si está seleccionado)
        if (sourceLanguage) {
            results = results.filter(approval => 
                approval.combination_details.toLowerCase().includes(sourceLanguage.toLowerCase())
            );
        }

        // Filtrar por idioma destino (si está seleccionado)
        if (targetLanguage) {
            results = results.filter(approval => 
                approval.combination_details.toLowerCase().includes(targetLanguage.toLowerCase())
            );
        }

        // Búsqueda general por texto
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            results = results.filter(approval => {
                return (
                    approval.translator_name?.toLowerCase().includes(term) ||
                    approval.superuser_email?.toLowerCase().includes(term) ||
                    approval.combination_details?.toLowerCase().includes(term) ||
                    approval.notes?.toLowerCase().includes(term) ||
                    approval.translator?.toString().includes(term)
                );
            });
        }

        return results;
    }, [allApprovals, sourceLanguage, targetLanguage, searchTerm]);

    // Actualizar resultados filtrados cuando cambian los filtros
    useEffect(() => {
        setFilteredApprovals(applyFilters);
    }, [applyFilters]);

    const handleReset = () => {
        setSearchTerm('');
        setSourceLanguage('');
        setTargetLanguage('');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const exportToCSV = () => {
        const headers = ['Traductor', 'Combinación', 'Homologado por', 'Fecha'];
        const rows = filteredApprovals.map(approval => [
            approval.translator_name,
            approval.combination_details,
            approval.superuser_email,
            formatDate(approval.approved_at),
            approval.notes || ''
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `homologaciones_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mt-4">
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h2 className="h4 mb-0">
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                            Combinaciones Homologadas
                        </h2>
                        <div className="d-flex gap-2">
                            <Badge bg="light" text="dark" className="fs-6">
                                Mostrando: {filteredApprovals.length} / {totalCount}
                            </Badge>
                            {filteredApprovals.length > 0 && (
                                <Button 
                                    variant="light" 
                                    size="sm"
                                    onClick={exportToCSV}
                                >
                                    <FontAwesomeIcon icon={faDownload} className="me-1" />
                                    Exportar CSV
                                </Button>
                            )}
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
                                    placeholder="Buscar por traductor, administrador o combinación de idiomas..."
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
                            <Form.Text className="text-muted">
                                Búsqueda en: nombre del traductor, email del administrador y combinación de idiomas
                            </Form.Text>
                        </Col>
                    </Row>

                    {/* Fila 2: Filtros de idiomas y acciones */}
                    <Row className="mb-3 align-items-end">
                        <Col md={5}>
                            <Form.Group>
                                <Form.Label>
                                    <FontAwesomeIcon icon={faLanguage} className="me-1" />
                                    Idioma Origen
                                </Form.Label>
                                <Form.Select
                                    value={sourceLanguage}
                                    onChange={(e) => setSourceLanguage(e.target.value)}
                                    disabled={loadingLanguages}
                                >
                                    <option value="">Todos los idiomas origen</option>
                                    {sourceLanguages.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        
                        <Col md={5}>
                            <Form.Group>
                                <Form.Label>
                                    <FontAwesomeIcon icon={faLanguage} className="me-1" />
                                    Idioma Destino
                                </Form.Label>
                                <Form.Select
                                    value={targetLanguage}
                                    onChange={(e) => setTargetLanguage(e.target.value)}
                                    disabled={loadingLanguages}
                                >
                                    <option value="">Todos los idiomas destino</option>
                                    {targetLanguages.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={2}>
                            <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={handleReset}
                                className="w-100"
                            >
                                <FontAwesomeIcon icon={faEraser} className="me-2" />
                                Limpiar
                            </Button>
                        </Col>
                    </Row>

                    {/* Indicadores de filtros activos */}
                    {(searchTerm || sourceLanguage || targetLanguage) && (
                        <Row className="mb-3">
                            <Col xs={12}>
                                <div className="d-flex flex-wrap gap-2 align-items-center">
                                    <span className="text-muted small">
                                        <FontAwesomeIcon icon={faFilter} className="me-1" />
                                        Filtros activos:
                                    </span>
                                    {searchTerm && (
                                        <Badge bg="info" pill className="d-flex align-items-center gap-1">
                                            Buscar: "{searchTerm}"
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                className="text-white p-0 ms-1"
                                                onClick={() => setSearchTerm('')}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </Badge>
                                    )}
                                    {sourceLanguage && (
                                        <Badge bg="info" pill className="d-flex align-items-center gap-1">
                                            Origen: {sourceLanguages.find(l => l.code === sourceLanguage)?.name || sourceLanguage}
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                className="text-white p-0 ms-1"
                                                onClick={() => setSourceLanguage('')}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </Badge>
                                    )}
                                    {targetLanguage && (
                                        <Badge bg="info" pill className="d-flex align-items-center gap-1">
                                            Destino: {targetLanguages.find(l => l.code === targetLanguage)?.name || targetLanguage}
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                className="text-white p-0 ms-1"
                                                onClick={() => setTargetLanguage('')}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </Badge>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* Tabla de resultados */}
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Cargando homologaciones...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">
                            <Alert.Heading>Error</Alert.Heading>
                            <p>{error}</p>
                        </Alert>
                    ) : filteredApprovals.length === 0 ? (
                        <Alert variant="info">
                            <Alert.Heading>No hay resultados</Alert.Heading>
                            <p>No se encontraron combinaciones homologadas con los criterios de búsqueda seleccionados.</p>
                            {(searchTerm || sourceLanguage || targetLanguage) && (
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
                                        <th>Traductor</th>
                                        <th>Combinación</th>
                                        <th>Homologado por</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApprovals.map((approval) => (
                                        <tr key={approval.id}>
                                            <td>
                                                <Link 
                                                    to={`/translator-detail/${approval.translator}/`} 
                                                    className="text-decoration-none fw-bold"
                                                >
                                                    {approval.translator_name}
                                                </Link>
                                            </td>
                                            <td>
                                                {approval.combination_details}
                                            </td>
                                            <td>
                                                <div>
                                                    <FontAwesomeIcon icon={faUser} className="me-1 text-muted" />
                                                    {approval.superuser_email}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-nowrap">
                                                    <FontAwesomeIcon icon={faCalendar} className="me-1 text-muted" />
                                                    {formatDate(approval.approved_at)}
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

            {/* Estadísticas resumidas */}
            {!loading && filteredApprovals.length > 0 && (
                <Card className="shadow-sm">
                    <Card.Header className="bg-secondary text-white">
                        <h5 className="mb-0">Resumen</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row className="text-center">
                            <Col md={4}>
                                <div>
                                    <h3 className="text-primary">{filteredApprovals.length}</h3>
                                    <p className="text-muted mb-0">Resultados mostrados</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div>
                                    <h3 className="text-primary">{totalCount}</h3>
                                    <p className="text-muted mb-0">Total homologaciones</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div>
                                    <h3 className="text-primary">
                                        {totalCount > 0 ? Math.round((filteredApprovals.length / totalCount) * 100) : 0}%
                                    </h3>
                                    <p className="text-muted mb-0">del total</p>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default ApprovedCombinations;