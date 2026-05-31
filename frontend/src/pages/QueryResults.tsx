import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { executeQuery, getQueries } from '../services/api';
import { Table, Card, Alert, Form, Badge, Spinner, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { 
    faList, 
    faPlusCircle, 
    faFileExcel,
    faDownload,
    faDatabase,
    faClock,
    faColumns,
    faCheckCircle,
    faSlidersH
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkButton from '../components/ui/LinkButton';
import * as XLSX from 'xlsx';
import {
  Query,
  ResultRow,
  LanguageCombination,
  ExportRow,
  FieldMapping,
  Translator,
  ProfessionalProfile,
  ProcessedRow,
  QueryCondition
} from '../types/Types';

// Configuración de campos disponibles
interface AvailableField {
    key: string;
    label: string;
    model: string;
    required: boolean;
}

const QueryResults: React.FC = () => {
  const { queryId: initialQueryId } = useParams<{ queryId: string }>();
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(() => {
    // Si hay queryId en URL, usarlo (ignorar localStorage)
    if (initialQueryId) {
      return initialQueryId;
    }
    // Si no hay queryId en URL, intentar cargar desde localStorage
    const saved = localStorage.getItem('lastSelectedQueryId');
    return saved || null;
  });
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [allColumns, setAllColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [results, setResults] = useState<ProcessedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);

  const fieldMapping: FieldMapping = useMemo(
    () => ({
      Translator: {
        id: "ID",
        email: "Email",
        first_name: "Nombre",
        last_name: "Apellidos",
        country: "País",
        province: "Provincia",
        city: "Ciudad",
        postal_code: "CP",
        mobile_phone: "Teléfono",
        registration_date: "Fecha registro",
        last_access: "Último acceso"
      },
      ProfessionalProfile: {
        native_languages: "Idiomas nativos",
        education: "Educación",
        degree: "Titulación",
        employment_status: "Situación laboral",
        experience: "Experiencia",
        softwares: "Software"
      },
      LanguageCombination: {
        source_language: "Origen",
        target_language: "Destino",
        price_per_word: "P/palabra",
        sworn_price_per_word: "P/palabra jurada",
        price_per_hour: "P/hora",
        services: "Servicios",
        text_types: "Tipos de texto"
      }
    }), []
  );

  // Definir campos disponibles para selección
  const availableFields: AvailableField[] = useMemo(() => {
    const fields: AvailableField[] = [];
    
    // Campos obligatorios
    fields.push({
        key: 'Translator_email',
        label: 'Email',
        model: 'Translator',
        required: true
    });
    
    fields.push({
        key: 'ProfessionalProfile_native_languages',
        label: 'Idiomas nativos',
        model: 'ProfessionalProfile',
        required: true
    });
    
    fields.push({
        key: 'LanguageCombination',
        label: 'Combinaciones de idiomas',
        model: 'LanguageCombination',
        required: true
    });
    
    // Campos opcionales de Translator
    const optionalTranslatorFields = ['first_name', 'last_name', 'country', 'province', 
                                       'postal_code', 'mobile_phone', 'registration_date', 'last_access'];
    optionalTranslatorFields.forEach(field => {
        fields.push({
            key: `Translator_${field}`,
            label: fieldMapping.Translator[field as keyof typeof fieldMapping.Translator] || field,
            model: 'Translator',
            required: false
        });
    });
    
    // Campos opcionales de ProfessionalProfile
    const optionalProfileFields = ['education', 'degree', 'employment_status', 'experience', 'softwares'];
    optionalProfileFields.forEach(field => {
        fields.push({
            key: `ProfessionalProfile_${field}`,
            label: fieldMapping.ProfessionalProfile[field as keyof typeof fieldMapping.ProfessionalProfile] || field,
            model: 'ProfessionalProfile',
            required: false
        });
    });
    
    return fields;
  }, [fieldMapping]);

  // Cargar preferencias de columnas desde localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('selectedColumns');
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        // Asegurar que los campos obligatorios están incluidos
        const requiredKeys = availableFields.filter(f => f.required).map(f => f.key);
        const mergedColumns = [...new Set([...requiredKeys, ...parsed])];
        setSelectedColumns(mergedColumns);
      } catch (e) {
        // Si hay error, usar campos obligatorios
        console.error("Error al cargar preferencias de columnas:", e);
        setSelectedColumns(availableFields.filter(f => f.required).map(f => f.key));
      }
    } else {
      // Por defecto: campos obligatorios + algunos opcionales
      const defaultColumns = availableFields
        .filter(f => f.required || ['Translator_first_name', 'Translator_last_name', 'ProfessionalProfile_experience'].includes(f.key))
        .map(f => f.key);
      setSelectedColumns(defaultColumns);
    }
  }, [availableFields]);

  // Guardar columnas seleccionadas en localStorage
  const saveColumnPreferences = useCallback((columns: string[]) => {
    localStorage.setItem('selectedColumns', JSON.stringify(columns));
    setSelectedColumns(columns);
  }, []);

  const toggleColumn = (columnKey: string) => {
    const field = availableFields.find(f => f.key === columnKey);
    if (field?.required) return; // No permitir desmarcar campos obligatorios
    
    if (selectedColumns.includes(columnKey)) {
      saveColumnPreferences(selectedColumns.filter(c => c !== columnKey));
    } else {
      saveColumnPreferences([...selectedColumns, columnKey]);
    }
  };

  const selectAllOptional = () => {
    const optionalKeys = availableFields.filter(f => !f.required).map(f => f.key);
    const requiredKeys = availableFields.filter(f => f.required).map(f => f.key);
    saveColumnPreferences([...requiredKeys, ...optionalKeys]);
  };

  const clearOptional = () => {
    const requiredKeys = availableFields.filter(f => f.required).map(f => f.key);
    saveColumnPreferences(requiredKeys);
  };

  const exportToExcel = () => {
    if (results.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const formattedData: ExportRow[] = results.map(row => {
      const newRow: ExportRow = {};

      selectedColumns.forEach(col => {
        if (col === "LanguageCombination") {
          const combos = row.LanguageCombination;
          newRow[getAlternateColumnName(col)] =
            combos
              ?.map(c => `${c.source_language} → ${c.target_language}`)
              .join(" | ") || "N/A";
        } else {
          const cell = row[col];
          newRow[getAlternateColumnName(col)] = cell !== undefined && cell !== null ? String(cell) : "N/A";
        }
      });

      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
    XLSX.writeFile(workbook, `Consulta_${selectedQuery?.name || selectedQueryId}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  useEffect(() => {
    async function fetchQueries() {
      try {
        const data = await getQueries();
        if (data.queries && data.queries.length > 0) {
          const sortedQueries: Query[] = data.queries.sort(
            (a: Query, b: Query) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setQueries(sortedQueries);

          if (!selectedQueryId && sortedQueries.length > 0) {
            setSelectedQueryId(sortedQueries[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Error al obtener las consultas:", err);
        setError('Error al cargar las consultas disponibles. ' + String(err));
      }
    }
    fetchQueries();
  }, []);

  // Guardar última consulta seleccionada
  useEffect(() => {
    if (selectedQueryId) {
      localStorage.setItem('lastSelectedQueryId', selectedQueryId);
    }
  }, [selectedQueryId]);

  useEffect(() => {
    async function fetchResults() {
      if (!selectedQueryId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await executeQuery(selectedQueryId);

        if (!Array.isArray(data.results)) {
          throw new Error("Los resultados no son un arreglo válido.");
        }

        const extractedColumns: string[] = [];
        const processedResults: ProcessedRow[] = [];

        // Extraer todas las columnas disponibles
        Object.keys(fieldMapping).forEach(modelKey => {
          if (modelKey !== "LanguageCombination") {
            Object.keys(fieldMapping[modelKey]).forEach(field => {
              const columnKey = `${modelKey}_${field}`;
              if (!extractedColumns.includes(columnKey)) {
                extractedColumns.push(columnKey);
              }
            });
          }
        });
        extractedColumns.push("LanguageCombination");
        setAllColumns(extractedColumns);

        data.results.forEach((row: ResultRow) => {
          const processedRow: ProcessedRow = {};

          if (row.Translator && fieldMapping.Translator) {
            Object.keys(fieldMapping.Translator).forEach(field => {
              const columnKey = `Translator_${field}`;
              const value = (row.Translator as Translator)[field as keyof typeof row.Translator];
              processedRow[columnKey] = value !== undefined && value !== null ? String(value) : "N/A";
            });
          }

          if (row.ProfessionalProfile && fieldMapping.ProfessionalProfile) {
            Object.keys(fieldMapping.ProfessionalProfile).forEach(field => {
              const columnKey = `ProfessionalProfile_${field}`;
              const value = (row.ProfessionalProfile as ProfessionalProfile)[field as keyof typeof row.ProfessionalProfile];
              processedRow[columnKey] = value !== undefined && value !== null ? String(value) : "N/A";
            });
          }

          if (row.LanguageCombination) {
            processedRow.LanguageCombination = row.LanguageCombination;
          }

          processedResults.push(processedRow);
        });

        setResults(processedResults);
      } catch (err) {
        console.error("Error al procesar los resultados:", err);
        if (err instanceof Error) {
          const maybeResponseError = (err as unknown as { response?: { data?: { error?: string } } });
          setError("Error: " + (maybeResponseError.response?.data?.error || err.message));
        } else {
          setError("Error desconocido al obtener resultados.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [selectedQueryId, fieldMapping]);

  useEffect(() => {
    if (selectedQueryId) {
      const query = queries.find(q => q.id == selectedQueryId);
      setSelectedQuery(query || null);
    }
  }, [selectedQueryId, queries]);

  const getAlternateColumnName = (columnKey: string): string => {
    const field = availableFields.find(f => f.key === columnKey);
    if (field) return field.label;
    
    // Fallback
    const [modelKey, ...fieldParts] = columnKey.split("_");
    const fieldName = fieldParts.join("_");
    if (fieldMapping[modelKey] && fieldMapping[modelKey][fieldName]) {
      return fieldMapping[modelKey][fieldName];
    }
    return columnKey;
  };

  const renderLanguageCombinationTable = (combinations?: LanguageCombination[] | string[]) => {
    if (!combinations || combinations.length === 0) {
      return <span className="text-muted">N/A</span>;
    }

    if (typeof combinations[0] === 'string') {
      return (
        <div className="small">
          {(combinations as string[]).map((c, i) => (
            <div key={i}>• {c}</div>
          ))}
        </div>
      );
    }

    const combos = combinations as LanguageCombination[];

    return (
      <div className="table-responsive">
        <Table striped bordered size="sm" className="mb-0 small">
          <thead>
            <tr className="text-nowrap">
              <th>Origen</th>
              <th>Destino</th>
              <th>P/palabra</th>
              <th>Servicios</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((combination, index) => (
              <tr key={index}>
                <td>{combination.source_language || 'N/A'}</td>
                <td>{combination.target_language || 'N/A'}</td>
                <td>{combination.price_per_word || 'N/A'} €</td>
                <td className="text-truncate" style={{ maxWidth: '150px' }}>
                  {combination.services || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQueryId(e.target.value || null);
  };

  const formatQuery = (q: QueryCondition[] = []): JSX.Element[] => {
    return q.map((item, index) => (
      <div key={index} className="mb-1">
        <code>
          <strong>{item.model}.{item.field}</strong> {item.operator} "{item.value}"
          {item.logical && <span className="text-muted ms-2">({item.logical})</span>}
        </code>
      </div>
    ));
  };

  // Obtener columnas visibles para la tabla
  const visibleColumns = allColumns.filter(col => selectedColumns.includes(col));

  if (error) {
    return (
      <div className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="h4 mb-0">
              <FontAwesomeIcon icon={faDatabase} className="me-2" />
              Resultados de Consulta
            </h2>
            <div className="d-flex gap-2">
              {selectedQuery && (
                <Badge bg="light" text="dark" className="fs-6">
                  {selectedQuery.name}
                </Badge>
              )}
              <Button 
                variant="light" 
                size="sm"
                onClick={() => setShowColumnSelector(true)}
              >
                <FontAwesomeIcon icon={faColumns} className="me-1" />
                Columnas
              </Button>
              {results.length > 0 && (
                <Button 
                  variant="light" 
                  size="sm"
                  onClick={exportToExcel}
                >
                  <FontAwesomeIcon icon={faDownload} className="me-1" />
                  Exportar
                </Button>
              )}
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Selector de consulta */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FontAwesomeIcon icon={faDatabase} className="me-2" />
              Consultas disponibles
            </Form.Label>
            <Form.Select 
              value={selectedQueryId || ''} 
              onChange={handleQueryChange}
            >
              <option value="">Selecciona una consulta</option>
              {queries.length > 0 &&
                queries.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({new Date(q.created_at).toLocaleDateString()})
                  </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Detalle de la consulta */}
          {selectedQuery && selectedQuery.query && selectedQuery.query.length > 0 && (
            <div className="mb-4">
              <div className="border rounded p-3">
                <h6 className="mb-2 text-muted">
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  Criterios de la consulta:
                </h6>
                <div className="small">
                  {formatQuery(selectedQuery.query)}
                </div>
              </div>
            </div>
          )}

          {/* Resultados */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Ejecutando consulta...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success me-1" />
                  {results.length} {results.length === 1 ? 'resultado' : 'resultados'} encontrados
                </span>
                <span className="text-muted small">
                  <FontAwesomeIcon icon={faColumns} className="me-1" />
                  {visibleColumns.length} columnas visibles
                </span>
              </div>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-dark">
                    <tr>
                      {visibleColumns.map((col, index) => (
                        <th key={index} className="text-nowrap">
                          {col === "LanguageCombination" ? "Combinaciones" : getAlternateColumnName(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {visibleColumns.map((col, colIndex) => (
                          <td key={colIndex} className="align-middle">
                            {col === "LanguageCombination" ? (
                              renderLanguageCombinationTable(row[col] as LanguageCombination[] | undefined)
                            ) : col === "Translator_email" ? (
                              <Link 
                                  to={`/translator-detail/${row['Translator_id']}/`} 
                                  className="text-decoration-none fw-bold"
                              >
                                  {String(row[col] ?? 'Ver')}
                              </Link>

                            ) : (
                              <span className="small">
                                {String(row[col] ?? 'N/A')}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          ) : selectedQueryId ? (
            <Alert variant="info" className="text-center">
              <p className="mb-0">No se encontraron resultados para esta consulta.</p>
            </Alert>
          ) : (
            <Alert variant="secondary" className="text-center">
              <p className="mb-0">Selecciona una consulta para ver los resultados.</p>
            </Alert>
          )}
        </Card.Body>
        <Card.Footer>
          <Row className="g-2">
            <Col xs={12} md={4}>
              <LinkButton to="/list-queries" icon={faList} variant="success" size="lg" className="w-100">
                Listar consultas
              </LinkButton>
            </Col>
            <Col xs={12} md={4}>
              <LinkButton to="/query-form" icon={faPlusCircle} variant="primary" size="lg" className="w-100">
                Crear consulta
              </LinkButton>
            </Col>
            <Col xs={12} md={4}>
              {results.length > 0 && (
                <Button variant="warning" size="lg" onClick={exportToExcel} className="w-100">
                  <FontAwesomeIcon icon={faFileExcel} className="me-2" />
                  Exportar Excel
                </Button>
              )}
            </Col>
          </Row>
        </Card.Footer>
      </Card>

      {/* Panel de selección de columnas */}
      <Offcanvas show={showColumnSelector} onHide={() => setShowColumnSelector(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FontAwesomeIcon icon={faSlidersH} className="me-2" />
            Seleccionar columnas
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-3">
            <Button variant="outline-primary" size="sm" onClick={selectAllOptional} className="me-2">
              Seleccionar todas
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={clearOptional}>
              Solo obligatorias
            </Button>
          </div>
          
          <div className="mb-3 text-muted small">
            <FontAwesomeIcon icon={faCheckCircle} className="text-success me-1" />
            Los campos marcados con <Badge bg="success" className="ms-1">Obligatorio</Badge> no pueden ocultarse
          </div>
          
          <hr />
          
          {availableFields.map((field) => {
            const isSelected = selectedColumns.includes(field.key);
            const isRequired = field.required;
            
            return (
              <Form.Check
                key={field.key}
                type="checkbox"
                id={field.key}
                label={
                  <span>
                    {field.label}
                    {isRequired && (
                      <Badge bg="success" className="ms-2" style={{ fontSize: '0.7rem' }}>
                        Obligatorio
                      </Badge>
                    )}
                  </span>
                }
                checked={isSelected}
                onChange={() => toggleColumn(field.key)}
                disabled={isRequired}
                className="mb-2 py-1"
              />
            );
          })}
          
          <hr />
          
          <div className="mt-3">
            <Button variant="primary" onClick={() => setShowColumnSelector(false)} className="w-100">
              Aplicar
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Estadísticas resumidas */}
      {!loading && results.length > 0 && (
        <Card className="shadow-sm">
          <Card.Header className="bg-secondary text-white">
            <h5 className="mb-0">Resumen</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="text-center">
                  <h3 className="text-primary">{results.length}</h3>
                  <p className="text-muted mb-0">Resultados obtenidos</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center">
                  <h3 className="text-primary">{visibleColumns.length}</h3>
                  <p className="text-muted mb-0">Columnas visibles</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default QueryResults;