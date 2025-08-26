import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTranslatorDetail } from '../services/api';
import { Translator } from '../types/Types';
import TranslatorProfile from '../components/translators/TranslatorData';

const TranslatorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [translator, setTranslator] = useState<Translator | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!id) {
            setError('ID no válido.');
            setLoading(false);
            return;
        }

        const fetchTranslator = async () => {
            try {
                const data = await getTranslatorDetail(id);
                setTranslator(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        
        fetchTranslator();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!translator) {
        return <div>No se encontró el traductor.</div>;
    }

    return (
        <div className="mt-4">
            <TranslatorProfile translator={translator} />
        </div>
    );
};

export default TranslatorDetail;
