import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTranslatorDetail, approveLanguageCombination, disapproveLanguageCombination } from '../services/api';
import { Translator } from '../types/Types';
import TranslatorProfile from '../components/translators/TranslatorData';
import { Alert, Spinner } from 'react-bootstrap';

const TranslatorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [translator, setTranslator] = useState<Translator | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [approving, setApproving] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    const handleApprove = async (combinationId: number) => {
        if (!id) return;
        setApproving(combinationId);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const result = await approveLanguageCombination(parseInt(id), combinationId);
            if (result.success) {
                setSuccessMessage(`Combinación homologada correctamente`);
                // Recargar datos del traductor
                const updatedTranslator = await getTranslatorDetail(id);
                setTranslator(updatedTranslator);
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError(result.error || 'Error al homologar la combinación');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setApproving(null);
        }
    };

    const handleDisapprove = async (approvalId: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta homologación?')) return;
        
        setApproving(approvalId);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const result = await disapproveLanguageCombination(approvalId);
            if (result.success) {
                setSuccessMessage(`Homologación eliminada correctamente`);
                // Recargar datos del traductor
                const updatedTranslator = await getTranslatorDetail(id!);
                setTranslator(updatedTranslator);
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError(result.error || 'Error al eliminar la homologación');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setApproving(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Cargando datos del traductor...</p>
            </div>
        );
    }

    if (error && !translator) {
        return (
            <Alert variant="danger" className="mt-4">
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
            </Alert>
        );
    }

    if (!translator) {
        return (
            <Alert variant="warning" className="mt-4">
                <Alert.Heading>No encontrado</Alert.Heading>
                <p>No se encontró el traductor solicitado.</p>
            </Alert>
        );
    }

    return (
        <div className="mt-4">
            {successMessage && (
                <Alert variant="success" className="mb-3" onClose={() => setSuccessMessage(null)} dismissible>
                    {successMessage}
                </Alert>
            )}
            {error && (
                <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}
            
            {/* Componente existente de perfil con props adicionales */}
            <TranslatorProfile 
                translator={translator}
                onApprove={handleApprove}
                onDisapprove={handleDisapprove}
                approving={approving}
            />
        </div>
    );
};

export default TranslatorDetail;