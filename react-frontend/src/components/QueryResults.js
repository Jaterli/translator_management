import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { executeQuery, getQueries } from '../services/api';
import { Table, Card, Alert, Button, Container, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

function QueryResults() {
  const { queryId: initialQueryId } = useParams();
  const [queries, setQueries] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState(initialQueryId);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [query, setQuery] = useState(null);
  const [columns, setColumns] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Memoizamos fieldMapping para evitar recrearlo en cada renderizado
  const fieldMapping = useMemo(() => ({
    Translator: {
      first_name: "Nombre",
      email: "Email",
      country: "País",
    },
    ProfessionalProfile: {
      native_languages: "Idiomas nativos",
      education: "Educación",
      experience: "Experiencia",
    },
    LanguageCombination: {
      source_language: "Origen",
      target_language: "Destino",
      price_per_word: "P/pal.",
      services: "Servicios",
      text_types: "Texto",
    },
  }), []);

  // Obtener y ordenar las consultas por fecha (created_at) de manera descendente
  useEffect(() => {
    async function fetchQueries() {
      try {
        const data = await getQueries();
        // Ordenar las consultas por fecha (created_at) de manera descendente
        const sortedQueries = data.queries.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setQueries(sortedQueries);

        // Si no hay una consulta seleccionada, seleccionar la última consulta
        if (!initialQueryId && sortedQueries.length > 0) {
          setSelectedQueryId(sortedQueries[0].id);
        }
      } catch (err) {
        console.error("Error al obtener las consultas:", err);
        setError('Error al cargar las consultas disponibles.');
      }
    }
    fetchQueries();
  }, [initialQueryId]); // Dependencia de initialQueryId

  // Ejecutar la consulta seleccionada
  useEffect(() => {
    async function fetchResults() {
      if (!selectedQueryId) return;

      try {
        const data = await executeQuery(selectedQueryId);
        console.log("Resultado completo del JSON:", data);

        if (!Array.isArray(data.results)) {
          throw new Error('Los resultados no son un arreglo válido.');
        }

        const extractedColumns = [];
        const processedResults = [];

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

        data.results.forEach(row => {
          const processedRow = {};

          Object.keys(row).forEach(modelKey => {
            if (modelKey !== "LanguageCombination" && fieldMapping[modelKey]) {
              Object.keys(fieldMapping[modelKey]).forEach(field => {
                const columnKey = `${modelKey}_${field}`;
                processedRow[columnKey] = row[modelKey][field];
              });
            }
          });

          if (row.LanguageCombination) {
            processedRow.LanguageCombination = row.LanguageCombination.map(combination => {
              const filteredCombination = {};
              Object.keys(fieldMapping.LanguageCombination).forEach(field => {
                if (combination[field] !== undefined) {
                  filteredCombination[field] = combination[field];
                }
              });
              return filteredCombination;
            });
          }

          processedResults.push(processedRow);
        });

        setQuery(data.query || `Consulta #${selectedQueryId}`);
        setColumns(extractedColumns);
        setResults(processedResults);
        setError(null);
      } catch (err) {
        console.error("Error al procesar los resultados:", err);
        setError(err.response?.data?.error || 'Error al obtener resultados.');
      }
    }
    fetchResults();
  }, [selectedQueryId, fieldMapping]);

  // Actualizar la consulta seleccionada cuando cambia selectedQueryId o queries
  useEffect(() => {
    if (selectedQueryId) {
      const query = queries.find(q => q.id === parseInt(selectedQueryId));
      setSelectedQuery(query);
    }
  }, [selectedQueryId, queries]);

  const getAlternateColumnName = (columnKey) => {
    const [modelKey, ...fieldParts] = columnKey.split("_");
    const field = fieldParts.join("_");

    if (fieldMapping[modelKey] && fieldMapping[modelKey][field]) {
      return fieldMapping[modelKey][field];
    }
    return columnKey;
  };

  const renderLanguageCombinationTable = (combinations) => {
    return (
      <Table striped bordered size="sm" className="mb-0 fs-s">
        <thead>
          <tr>
            {Object.keys(fieldMapping.LanguageCombination).map((field, index) => (
              <th key={index}>{fieldMapping.LanguageCombination[field]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {combinations.map((combination, index) => (
            <tr key={index}>
              {Object.keys(fieldMapping.LanguageCombination).map((field, idx) => (
                <td key={idx}>{combination[field] || 'N/A'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const handleQueryChange = (e) => {
    setSelectedQueryId(e.target.value);
  };

  const formatQuery = (query) => {
    if (!query) return '';
    return query.map((q, index) => (
      <div key={index}>
        <strong>{q.model}.{q.field}</strong> {q.operator} "{q.value}" {q.logical ? `(${q.logical})` : ''}
      </div>
    ));
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h2" className="text-center">
          Resultados de la consulta: {query}
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-4">
            <Form.Label>Consultas:</Form.Label>
            <Form.Select value={selectedQueryId} onChange={handleQueryChange}>
              <option value="">Selecciona una consulta</option>
              {queries.map((query) => (
                <option key={query.id} value={query.id}>
                  {query.name} ({new Date(query.created_at).toLocaleDateString()})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedQuery && (
            <div className="mb-4">              
              <div className="border rounded bg-body-secondary p-3 fs-s">
                <h5>Consulta seleccionada:</h5>
                {formatQuery(selectedQuery.query)}
              </div>
            </div>
          )}

          {results.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index}>
                      {col === "LanguageCombination" ? "Combinaciones de idiomas" : getAlternateColumnName(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col === "LanguageCombination" ? (
                          renderLanguageCombinationTable(row[col])
                        ) : (
                          row[col] || 'N/A'
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No se han encontrado resultados.</Alert>
          )}
        </Card.Body>
        <Card.Footer className="text-center">
          <Button variant="success" href="/list_queries" size="lg" className="me-3">
            <FontAwesomeIcon icon={faList} /> Listar consultas
          </Button>
          <Button variant="primary" href="/query_form" size="lg">
            <FontAwesomeIcon icon={faPlusCircle} /> Crear una consulta
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default QueryResults;