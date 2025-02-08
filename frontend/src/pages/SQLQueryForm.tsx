import React, { useState, useEffect } from 'react';
import { getFields, saveQuery } from '../services/api.ts';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import LinkButton from '../components/ui/LinkButton.tsx';

// Definición de tipos
interface Field {
  name: string;
  model: string;
  type: string;
  verbose_name?: string;
  choices?: [string, string][];
}

interface Condition {
  model: string;
  field: string;
  operator: string;
  value: string;
  logical: string;
  fieldType: string;
  choices: [string, string][] | null;
}

const exclude_fields: Record<string, string[]> = {
  'Translator': ['password', 'is_superuser', 'is_active', 'is_staff', 'groups', 'user_permissions'],
  'ProfessionalProfile': ['translator'],
  'LanguageCombination': [],
};

const SQLQueryForm: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [queryName, setQueryName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate(); // Hook de React Router para redirección

  useEffect(() => {
    async function fetchFields() {
      try {
        const data = await getFields();

        // Filtra los campos excluidos
        const filteredFields = data.fields.filter((field: Field) => {
          const excludedFieldsForModel = exclude_fields[field.model] || [];
          return !excludedFieldsForModel.includes(field.name);
        });

        setFields(filteredFields || []);
      } catch (error) {
        console.error('Error fetching fields:', error);
        setError('Hubo un error al cargar los campos. Intenta de nuevo más tarde.');
      }
    }
    fetchFields();
  }, []);

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        model: '',
        field: '',
        operator: '=',
        value: '',
        logical: 'AND',
        fieldType: '',
        choices: null,
      },
    ]);
  };

  const removeCondition = (index: number) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  const handleFieldChange = (index: number, value: string) => {
    const fieldData = fields.find((f) => f.name === value);
    const updatedConditions = [...conditions];
    updatedConditions[index].model = fieldData ? fieldData.model : '';
    updatedConditions[index].field = value;
    updatedConditions[index].fieldType = fieldData ? fieldData.type : '';
    updatedConditions[index].choices = fieldData?.choices || null;

    setConditions(updatedConditions);
  };

  const handleConditionChange = (index: number, key: keyof Condition, value: string | [string, string][] | null) => {
    const updatedConditions = [...conditions];

    if (key === 'choices') {
      // Si la clave es 'choices', el valor debe ser [string, string][] o null
      updatedConditions[index][key] = value as [string, string][] | null;
    } else {
      // Para otras claves, el valor debe ser string
      updatedConditions[index][key] = value as string;
    }

    setConditions(updatedConditions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!queryName.trim()) {
      setError('El nombre de la consulta es obligatorio.');
      return;
    }

    const validConditions = conditions.filter((c) => c.field && c.operator && c.value);

    if (validConditions.length === 0) {
      setError('Debes agregar al menos una condición válida.');
      return;
    }

    const queryCriteria = validConditions.map((c, index) => ({
      logical: index > 0 ? c.logical : null,
      model: c.model,
      field: c.field,
      operator: c.operator,
      value: c.value,
    }));

    const payload = { name: queryName, query: queryCriteria };

    try {
      const response = await saveQuery(payload);
      alert(response.message || '¡Consulta guardada exitosamente!');
      setError('');
      navigate('/list_queries'); // Redirigir al listado de consultas
    } catch (error) {
      console.error('Error saving query:', error);
      setError('Hubo un error al guardar la consulta. Intenta de nuevo más tarde.');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 p-md-4 bg-light rounded-3">
      <h2 className="mb-4 text-center">Crear nueva consulta</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Nombre de la consulta:</Form.Label>
        <Form.Control
          type="text"
          value={queryName}
          onChange={(e) => setQueryName(e.target.value)}
          required
          placeholder="Ej: Español-Inglés"
        />
      </Form.Group>
      {conditions.map((condition, index) => (
        <Row key={index} className="mb-3 align-items-end">
          {index > 0 && (
            <Col xs={12} md={2} className="mb-2 mb-md-0">
              <Form.Select
                value={condition.logical}
                onChange={(e) => handleConditionChange(index, 'logical', e.target.value)}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </Form.Select>
            </Col>
          )}
          <Col xs={12} md={index > 0 ? 3 : 4} className="mb-2 mb-md-0">
            <Form.Select
              value={condition.field}
              onChange={(e) => handleFieldChange(index, e.target.value)}
              required
            >
              <option value="">Selecciona el campo</option>
              {fields.map((field) => (
                <option key={field.name} value={field.name}>
                  {field.verbose_name || field.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={2} className="mb-2 mb-md-0">
            <Form.Select
              value={condition.operator}
              onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
              required
            >
              <option value="=">igual a</option>
              <option value="!=">distinto a</option>
              {condition.fieldType === 'CharField' || condition.fieldType === 'TextField' || condition.fieldType === 'EmailField' ? (
                <>
                  <option value="LIKE">contiene</option>
                  <option value="NOT LIKE">no contiene</option>
                </>
              ) : (
                <>
                  <option value="<">menor que</option>
                  <option value="<=">menor o igual que</option>
                  <option value=">">mayor que</option>
                  <option value=">=">mayor o igual que</option>
                  <option value="IN">en</option>
                  <option value="NOT IN">no en</option>
                </>
              )}
            </Form.Select>
          </Col>
          <Col xs={12} md={3} className="mb-2 mb-md-0">
            {condition.choices ? (
              <Form.Select
                value={condition.value}
                onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                required
              >
                <option value="">Selecciona el valor</option>
                {condition.choices.map(([key, display]) => (
                  <option key={key} value={key}>
                    {display}
                  </option>
                ))}
              </Form.Select>
            ) : condition.fieldType === 'BigAutoField' ? (
              <Form.Control
                type="number"
                value={condition.value}
                onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                required
              />
            ) : condition.operator === 'IN' || condition.operator === 'NOT IN' ? (
              <Form.Control
                type="text"
                value={condition.value}
                onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                required
                placeholder="Valores separados por comas"
              />
            ) : (
              <Form.Control
                type="text"
                value={condition.value}
                onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                required
              />
            )}
          </Col>
          <Col xs={12} md={2} className="mb-2 mb-md-0">
            <Button variant="danger" onClick={() => removeCondition(index)} className="w-100">
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Col>
        </Row>
      ))}
      <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">

        <LinkButton onClick={addCondition} icon={faPlusCircle} className='w-100 mb-2 mb-md-0' variant="success" size="lg">
          Añadir condición
        </LinkButton>

        <LinkButton onClick={addCondition} icon={faSave} className='w-100' variant="primary" size="lg">
          Guardar consulta
        </LinkButton>

      </div>
    </Form>
  );
};

export default SQLQueryForm;