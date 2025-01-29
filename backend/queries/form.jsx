import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QueryBuilder = () => {
    const [tables, setTables] = useState([]);
    const [fields, setFields] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [selectedFields, setSelectedFields] = useState([]);

    useEffect(() => {
        // Carga de tablas desde el backend (puede ser una vista dedicada)
        axios.get('/api/tables/').then(response => setTables(response.data));
    }, []);

    const handleTableChange = (e) => {
        setSelectedTable(e.target.value);
        // Carga de campos relacionados
        axios.get(`/api/fields/?table=${e.target.value}`).then(response => setFields(response.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = {
            table: selectedTable,
            fields: selectedFields,
        };
        axios.post('/api/queries/', query).then(response => {
            alert('Consulta guardada exitosamente!');
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <select onChange={handleTableChange} value={selectedTable}>
                <option value="">Selecciona una tabla</option>
                {tables.map((table) => (
                    <option key={table} value={table}>{table}</option>
                ))}
            </select>

            <div>
                {fields.map((field) => (
                    <label key={field}>
                        <input
                            type="checkbox"
                            value={field}
                            onChange={(e) =>
                                setSelectedFields([...selectedFields, e.target.value])
                            }
                        />
                        {field}
                    </label>
                ))}
            </div>

            <button type="submit">Guardar Consulta</button>
        </form>
    );
};

export default QueryBuilder;
