import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { executeQuery, getQueries } from '../services/api';
import { Table, Card, Alert, Form } from 'react-bootstrap';
import { faList, faPlusCircle, faEye, faFileExcel } from '@fortawesome/free-solid-svg-icons';
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

const QueryResults: React.FC = () => {
  const { queryId: initialQueryId } = useParams<{ queryId: string }>();
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(initialQueryId || null);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  // Mostramos la query actual como string (id o representación)
  const [query, setQuery] = useState<string | null>(null);

  // columnas dinámicas: "Translator_first_name", "ProfessionalProfile_education", "LanguageCombination", ...
  const [columns, setColumns] = useState<string[]>([]);
  // results son las filas procesadas (ProcessedRow)
  const [results, setResults] = useState<ProcessedRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Memoizamos fieldMapping
  const fieldMapping: FieldMapping = useMemo(
    () => ({
      Translator: {
        id: "id",
        first_name: "Nombre",
        email: "Email",
        country: "País",
        postal_code: "CP"
      },
      ProfessionalProfile: {
        native_languages: "Idiomas nativos",
        education: "Educación",
        experience: "Experiencia"
      },
      LanguageCombination: {
        source_language: "Origen",
        target_language: "Destino",
        price_per_word: "P/pal.",
        services: "Servicios",
        text_types: "Texto"
      }
    }), []
  );

  const exportToExcel = () => {
    if (results.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    // ExportRow: todas las celdas finales como string
    const formattedData: ExportRow[] = results.map(row => {
      const newRow: ExportRow = {};

      columns.forEach(col => {
        if (col === "LanguageCombination") {
          // row.LanguageCombination es LanguageCombination[] | undefined
          const combos = row.LanguageCombination;
          newRow[col] =
            combos
              ?.map(c => Object.values(c).join(", ")) // convierto cada combinación a string
              .join(" | ") || "N/A";
        } else {
          // Para columnas normales (ya procesadas en processedRow) solo convierto a string
          const cell = row[col];
          newRow[getAlternateColumnName(col)] = cell ? String(cell) : "N/A";
        }
      });

      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
    XLSX.writeFile(workbook, `Consulta_${selectedQuery?.name || selectedQueryId}.xlsx`);
  };

  // Obtener y ordenar consultas
  useEffect(() => {
    async function fetchQueries() {
      try {
        const data = await getQueries();
        if (data.queries && data.queries.length > 0) {
          const sortedQueries: Query[] = data.queries.sort(
            (a: Query, b: Query) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setQueries(sortedQueries);

          if (!initialQueryId && sortedQueries.length > 0) {
            setSelectedQueryId(sortedQueries[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Error al obtener las consultas:", err);
        setError('Error al cargar las consultas disponibles. ' + String(err));
      }
    }
    fetchQueries();
  }, [initialQueryId]);

  // Ejecutar la consulta seleccionada y procesar resultados
  useEffect(() => {
    async function fetchResults() {
      if (!selectedQueryId) return;

      try {
        const data = await executeQuery(selectedQueryId);

        if (!Array.isArray(data.results)) {
          throw new Error("Los resultados no son un arreglo válido.");
        }

        const extractedColumns: string[] = [];
        const processedResults: ProcessedRow[] = [];

        // Construir lista de columnas (Translator_* y ProfessionalProfile_*)
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

        // Añadimos la columna de combinaciones (especial)
        extractedColumns.push("LanguageCombination");

        // Procesar cada fila recibida (data.results)
        data.results.forEach((row: ResultRow) => {
          const processedRow: ProcessedRow = {};

          // Aplanar Translator
          if (row.Translator && fieldMapping.Translator) {
            Object.keys(fieldMapping.Translator).forEach(field => {
              const columnKey = `Translator_${field}`;
              const value = (row.Translator as Translator)[field as keyof typeof row.Translator];
              processedRow[columnKey] = value !== undefined && value !== null ? String(value) : "N/A";
            });
          }

          // Aplanar ProfessionalProfile
          if (row.ProfessionalProfile && fieldMapping.ProfessionalProfile) {
            Object.keys(fieldMapping.ProfessionalProfile).forEach(field => {
              const columnKey = `ProfessionalProfile_${field}`;
              const value = (row.ProfessionalProfile as ProfessionalProfile)[field as keyof typeof row.ProfessionalProfile];
              // Aquí usamos `as any` solo para indexar propiedades del profile porque son campos dinámicos (but safe)
              processedRow[columnKey] = value !== undefined && value !== null ? String(value) : "N/A";
            });
          }

          // Mantener las combinaciones de idiomas como arreglo de objetos LanguageCombination (para render)
          if (row.LanguageCombination) {
            processedRow.LanguageCombination = row.LanguageCombination;
          }

          processedResults.push(processedRow);
        });

        // Guardar query como string para mostrar fallback
        setQuery(data.query ? JSON.stringify(data.query) : `#${selectedQueryId}`);
        setColumns(extractedColumns);
        setResults(processedResults);
        setError(null);
      } catch (err) {
        console.error("Error al procesar los resultados:", err);
        if (err instanceof Error) {
          const maybeResponseError = (err as unknown as { response?: { data?: { error?: string } } });
          setError("Error: " + (maybeResponseError.response?.data?.error || err.message));
        } else {
          setError("Error desconocido al obtener resultados.");
        }
      }
    }
    fetchResults();
    // fieldMapping es estable (useMemo con []), selectedQueryId define ejecución
  }, [selectedQueryId, fieldMapping]);

  // Actualizar selectedQuery cuando cambian queries o selectedQueryId
  useEffect(() => {
    if (selectedQueryId) {
      const query = queries.find(q => q.id == selectedQueryId);
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

  // Ahora renderLanguageCombinationTable espera LanguageCombination[] y usa fieldMapping
  const renderLanguageCombinationTable = (combinations?: LanguageCombination[] | string[]) => {
    if (!combinations || combinations.length === 0) {
      return 'N/A';
    }

    // Si por alguna razón vienen ya como strings (no debería ocurrir con la implementación actual),
    // lo mostramos en filas sencillas.
    if (typeof combinations[0] === 'string') {
      return (
        <Table striped bordered size="sm" className="mb-0 fs-custom-7">
          <tbody>
            {(combinations as string[]).map((c, i) => (
              <tr key={i}><td>{c}</td></tr>
            ))}
          </tbody>
        </Table>
      );
    }

    const combos = combinations as LanguageCombination[];

    return (
      <Table striped bordered size="sm" className="mb-0 fs-custom-7">
        <thead>
          <tr className='text-nowrap'>
            {Object.keys(fieldMapping.LanguageCombination).map((field, index) => (
              <th key={index}>{fieldMapping.LanguageCombination[field]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {combos.map((combination, index) => (
            <tr key={index}>
              {Object.keys(fieldMapping.LanguageCombination).map((field, idx) => (
                <td key={idx}>{(combination)[field as keyof LanguageCombination] || 'N/A'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQueryId(e.target.value || null);
  };

  const formatQuery = (q: QueryCondition[] = []): JSX.Element[] => {
    return q.map((item, index) => (
      <div key={index}>
        <strong>{item.model}.{item.field}</strong> {item.operator} "{item.value}" {item.logical ? `(${item.logical})` : ''}
      </div>
    ));
  };

  if (error) {
    return (
      <div className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <section className="mt-4">
      <Card>
        <Card.Header as="h1" className="text-center">
          Consulta "{selectedQuery ? selectedQuery.name : `${query}`}"
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-4">
            <Form.Label>Consultas:</Form.Label>
            <Form.Select value={selectedQueryId || ''} onChange={handleQueryChange}>
              <option value="">Selecciona una consulta</option>
              {queries.length > 0 &&
                queries.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({new Date(q.created_at).toLocaleDateString()})
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
                          renderLanguageCombinationTable(row[col] as LanguageCombination[] | undefined)
                        ) : col === "Translator_id" ? (
                          // Para Translator_id, row[col] es el id (string) que pusimos al aplanar
                          <Link to={`/translator-detail/${String(row[col])}/`}>
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        ) : (
                          String(row[col] ?? 'N/A')
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
          <LinkButton to="/list-queries" icon={faList} className='w-100 mb-2 mb-md-0' variant="success" size="lg">
            Listar consultas
          </LinkButton>
          <LinkButton to="/query-form" icon={faPlusCircle} className='w-100 mb-2 mb-md-0' variant="primary" size="lg">
            Crear una consulta
          </LinkButton>
          <LinkButton onClick={() => exportToExcel()} icon={faFileExcel} variant="warning" size="lg">
            Exportar a Excel
          </LinkButton>
        </Card.Footer>
      </Card>
    </section>
  );
};

export default QueryResults;
