import React, { useState, useEffect } from 'react';
import { getFields, saveQuery } from '../services/api';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Para redirigir

const exclude_fields = {
  'Translator': ['password', 'is_superuser', 'is_active', 'is_staff', 'groups', 'user_permissions'],
  'ProfessionalProfile': ['translator'],
  'LanguageCombination': [],
};

function SQLQueryForm() {
  const [fields, setFields] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [queryName, setQueryName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook de React Router para redirección

  useEffect(() => {
    async function fetchFields() {
      try {
        const data = await getFields();

        // Filtra los campos excluidos
        const filteredFields = data.fields.filter((field) => {
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

  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  const handleFieldChange = (index, value) => {
    const fieldData = fields.find((f) => f.name === value);
    const updatedConditions = [...conditions];
    updatedConditions[index].model = fieldData ? fieldData.model : '';
    updatedConditions[index].field = value;
    updatedConditions[index].fieldType = fieldData ? fieldData.type : '';
    updatedConditions[index].choices = fieldData ? fieldData.choices : null;

    setConditions(updatedConditions);
  };

  const handleConditionChange = (index, key, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][key] = value;
    setConditions(updatedConditions);
  };

  const handleSubmit = async (e) => {
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
    <Form onSubmit={handleSubmit} className="p-4 bg-light rounded-3">
      <h2 className="mb-4">Crear nueva consulta</h2>
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
            <Col md={2}>
              <Form.Select
                value={condition.logical}
                onChange={(e) => handleConditionChange(index, 'logical', e.target.value)}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </Form.Select>
            </Col>
          )}
          <Col md={index > 0 ? 3 : 4}>
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
          <Col md={2}>
            <Form.Select
              value={condition.operator}
              onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
              required
            >
              <option value="=">igual a</option>
              <option value="!=">distinto a</option>
              {condition.fieldType === 'CharField' || condition.fieldType === 'TextField' ? (
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
                </>
              )}
            </Form.Select>
          </Col>
          <Col md={3}>
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
            ) : (
              <Form.Control
                type="text"
                value={condition.value}
                onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                required
              />
            )}
          </Col>
          <Col md={2}>
            <Button variant="danger" onClick={() => removeCondition(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Col>
        </Row>
      ))}
      <div className="mt-4">
        <Button variant="success" onClick={addCondition}>
          <FontAwesomeIcon icon={faPlusCircle} /> Añadir condición
        </Button>
        <Button variant="primary" type="submit" className="ms-2">
          <FontAwesomeIcon icon={faSave} /> Guardar consulta
        </Button>
      </div>
    </Form>
  );
}

export default SQLQueryForm;
