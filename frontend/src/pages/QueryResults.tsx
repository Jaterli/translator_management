import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { executeQuery, getQueries } from '../services/api';
import { Table, Card, Alert, Container, Form } from 'react-bootstrap';
import { faList, faPlusCircle, faEye, faFileExcel } from '@fortawesome/free-solid-svg-icons'; // Importa el icono faEye
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa FontAwesomeIcon para usar el icono
import LinkButton from '../components/ui/LinkButton';
import * as XLSX from 'xlsx';

// Definición de tipos
interface Query {
  id: number;
  name: string;
  created_at: string;
  query: any[];
}

interface ResultRow {
  [key: string]: any;
}

interface FieldMapping {
  [key: string]: {
    [key: string]: string;
  };
}


const QueryResults: React.FC = () => {
  const { queryId: initialQueryId } = useParams<{ queryId: string }>();
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(initialQueryId || null);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Memoizamos fieldMapping para evitar recrearlo en cada renderizado
  const fieldMapping: FieldMapping = useMemo(() => ({
    Translator: {
      id: "id",
      first_name: "Nombre",
      email: "Email",
      country: "País",
      postal_code: "CP",
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


  const exportToExcel = () => {
    if (results.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }
  
    // Formatear los datos
    const formattedData = results.map(row => {
      const newRow: { [key: string]: any } = {};
      columns.forEach(col => {
        if (col === "LanguageCombination") {
          newRow[col] = row[col]?.map((combination: any) => 
            Object.values(combination).join(", ")
          ).join(" | ") || 'N/A';
        } else {
          newRow[getAlternateColumnName(col)] = row[col] || 'N/A';
        }
      });
      return newRow;
    });
  
    // Crear una hoja de trabajo (worksheet)
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
    // Crear un libro de trabajo (workbook)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
  
    // Guardar el archivo
    XLSX.writeFile(workbook, `Consulta_${selectedQuery?.name || selectedQueryId}.xlsx`);
  };
  

  // Obtener y ordenar las consultas por fecha (created_at) de manera descendente
  useEffect(() => {
    async function fetchQueries() {
      try {
        const data = await getQueries();
        const sortedQueries: Query[] = data.queries.sort((a: Query, b: Query) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setQueries(sortedQueries);

        // Si no hay una consulta seleccionada, seleccionar la última consulta
        if (!initialQueryId && sortedQueries.length > 0) {
          setSelectedQueryId(sortedQueries[0].id.toString());
        }
      } catch (err) {
        console.error("Error al obtener las consultas:", err);
        setError('Error al cargar las consultas disponibles.');
      }
    }
    fetchQueries();
  }, [initialQueryId]);

  // Ejecutar la consulta seleccionada
  useEffect(() => {
    async function fetchResults() {
      if (!selectedQueryId) return;

      try {
        const data:ResultRow = await executeQuery(selectedQueryId);
        console.log("Resultado completo del JSON:", data);

        if (!Array.isArray(data.results)) {
          throw new Error('Los resultados no son un arreglo válido.');
        }

        const extractedColumns: string[] = [];
        const processedResults: ResultRow[] = [];

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

        data.results.forEach((row: any) => {
          const processedRow: ResultRow = {};

          Object.keys(row).forEach(modelKey => {
            if (modelKey !== "LanguageCombination" && fieldMapping[modelKey]) {
              Object.keys(fieldMapping[modelKey]).forEach(field => {
                const columnKey = `${modelKey}_${field}`;
                processedRow[columnKey] = row[modelKey][field];
              });
            }
          });

          if (row.LanguageCombination) {
            processedRow.LanguageCombination = row.LanguageCombination.map((combination: any) => {
              const filteredCombination: any = {};
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

        setQuery(data.query || `#${selectedQueryId}`);
        setColumns(extractedColumns);
        setResults(processedResults);
        setError(null);
      } catch (err:any) {
        console.error("Error al procesar los resultados:", err);
        setError("Error: "+err.response?.data?.error || err.message || 'Error al obtener resultados.');
      }
    }
    fetchResults();
  }, [selectedQueryId, fieldMapping]);

  // Actualizar la consulta seleccionada cuando cambia selectedQueryId o queries
  useEffect(() => {
    if (selectedQueryId) {
      const query = queries.find(q => q.id === parseInt(selectedQueryId));
      setSelectedQuery(query || null);
    }
  }, [selectedQueryId, queries]);

  const getAlternateColumnName = (columnKey: string): string => {
    const [modelKey, ...fieldParts] = columnKey.split("_");
    const field = fieldParts.join("_");

    if (fieldMapping[modelKey] && fieldMapping[modelKey][field]) {
      return fieldMapping[modelKey][field];
    }
    return columnKey;
  };

  const renderLanguageCombinationTable = (combinations: any[]) => {
    if (!combinations || combinations.length === 0) {
      return 'N/A';
    }
        
    return (
      <Table striped bordered size="sm" className="mb-0 fs-custom-7">
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

  const handleQueryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQueryId(e.target.value);
  };

  const formatQuery = (query: any[]): JSX.Element[] => {
    if (!query) return [];
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
          Consulta "{selectedQuery ? selectedQuery.name : `#${query}`}"
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-4">
            <Form.Label>Consultas:</Form.Label>
            <Form.Select value={selectedQueryId || ''} onChange={handleQueryChange}>
              <option value="">Selecciona una consulta</option>
              {queries.length > 0 &&
                queries.map((query) => (
                  <option key={query.id} value={query.id}>
                    {query.name} ({new Date(query.created_at).toLocaleDateString()})
                  </option>
              ))}
            </Form.Select>
          </Form.Group>
  
          {selectedQuery && (
            <div className="mb-4">              
              <div className="border rounded bg-body-secondary p-3 fs-custom-7">
                <h5>SQL:</h5>
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
                        ) : col === "Translator_id" ? ( // Verifica si la columna es "Translator_id"
                          <Link to={`/translator_detail/${row[col]}/`}>
                            <FontAwesomeIcon icon={faEye} /> {/* Usa el icono faEye */}
                          </Link>
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
        <Card.Footer className="d-flex flex-column flex-md-row gap-2 justify-content-center">
          <LinkButton to="/list_queries" icon={faList} className='w-100 mb-2 mb-md-0' variant="success" size="lg">
            Listar consultas
          </LinkButton>
          <LinkButton to="/query_form" icon={faPlusCircle} className='w-100 mb-2 mb-md-0' variant="primary" size="lg">
            Crear una consulta
          </LinkButton>
          <LinkButton  onClick={() => exportToExcel()} icon={faFileExcel} variant="warning" size="lg">
            Exportar a Excel
          </LinkButton>          
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default QueryResults;