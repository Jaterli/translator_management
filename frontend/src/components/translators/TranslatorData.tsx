import React from 'react';
import LinkButton from '../ui/LinkButton';
import { faFileAudio, faFilePdf, faList, faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translator, LanguageCombinationApproval } from '../../types/Types';
import { Button, Badge } from 'react-bootstrap';

interface TranslatorProfileProps {
    translator: Translator;
    onApprove?: (combinationId: number) => void;
    onDisapprove?: (approvalId: number) => void;
    approving?: number | null;
}

const TranslatorProfile: React.FC<TranslatorProfileProps> = ({ 
    translator, 
    onApprove, 
    onDisapprove, 
    approving 
}) => {
    // Crear un mapa de combinaciones homologadas
    const approvedMap = new Map<number, LanguageCombinationApproval>();
    if (translator.approved_combinations) {
        translator.approved_combinations.forEach(approval => {
            approvedMap.set(approval.language_combination, approval);
        });
    }

    return (
        <>
            <div className="card mb-4 shadow-sm">
                {/* Cabecera de la carta principal */}
                <div className="card-header bg-primary text-white">
                    <h1 className="card-title fs-3 mb-1">{translator.first_name} {translator.last_name}</h1>
                    <h2 className="card-subtitle fs-5 mb-0">{translator.email}</h2>
                </div>
                <div className="card-body">

                    {/* Sección de archivos */}
                    <div className="row mb-3">
                        <div className="col-md-12">
                            {translator.files?.cv_file && (
                                <a href={`${translator.files.cv_file}`} className="btn btn-outline-primary me-2">
                                    <FontAwesomeIcon icon={faFilePdf} /> Descargar CV
                                </a>
                            )}
                            {translator.files?.voice_note && (
                                <a href={`${translator.files.voice_note}`} className="btn btn-outline-secondary">
                                    <FontAwesomeIcon icon={faFileAudio} /> Escuchar Nota de Voz
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p className="card-text">
                                <strong>Dirección:</strong><br />
                                {translator.address}, {translator.postal_code}, {translator.province}, {translator.country}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p className="card-text">
                                <strong>Idiomas nativos:</strong><br />
                                {translator.professional_profile?.native_languages || 'No especificado'}
                            </p>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p className="card-text">
                                <strong>Género:</strong><br />
                                {translator.gender === 'H' ? 'Hombre' : translator.gender === 'M' ? 'Mujer' : 'Otro'}
                            </p>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p className="card-text">
                                <strong>Fecha de registro:</strong><br />
                                {translator.registration_date 
                                    ? new Date(translator.registration_date).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    : 'N/A'}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p className="card-text">
                                <strong>Último acceso:</strong><br />
                                {translator.last_access 
                                    ? new Date(translator.last_access).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p className="card-text">
                                <strong>Educación:</strong><br />
                                {translator.professional_profile?.education || 'No especificado'}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p className="card-text">
                                <strong>Experiencia:</strong><br />
                                {translator.professional_profile?.experience || 'No especificado'}
                            </p>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <p className="card-text">
                                <strong>Software:</strong><br />
                                {translator.professional_profile?.softwares || 'No especificado'}
                            </p>
                        </div>
                    </div>                
                    
                    {/* Combinaciones de idiomas con botones de homologación */}
                    <div className="row mt-5">
                        <h3 className="mb-3">Combinaciones de idiomas</h3>
                        {translator.language_combination.map((combination) => {
                            const approval = approvedMap.get(combination.id);
                            const isApproved = !!approval;
                            const isLoading = approving === combination.id;
                            
                            return (
                                <div key={combination.id} className="col-md-6 mb-3">
                                    <div className="card h-100">
                                        <div className="card-header bg-body-secondary px-3 py-3 rounded-top d-flex justify-content-between align-items-center">
                                            <h3 className="fs-5 card-subtitle mb-0">
                                                <strong>De:</strong> {combination.source_language} <strong>A:</strong> {combination.target_language}
                                            </h3>
                                            {isApproved && (
                                                <Badge bg="success" pill>
                                                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                                                    Homologada
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="card-body">
                                            <ul className='list-group list-group-flush'>
                                                <li className='list-group-item'><strong>Servicios:</strong> {combination.services || 'No especificado'}</li>
                                                <li className='list-group-item'><strong>Tipos de texto:</strong> {combination.text_types || 'No especificado'}</li>
                                                <li className='list-group-item'><strong>Precio por palabra:</strong> {combination.price_per_word} €</li>
                                                <li className='list-group-item'><strong>Precio por palabra jurada:</strong> {combination.sworn_price_per_word ? combination.sworn_price_per_word + ' €' : 'No disponible'}</li>
                                                <li className='list-group-item'><strong>Precio por hora:</strong> {combination.price_per_hour ? combination.price_per_hour + ' €' : 'No disponible'}</li>   
                                            </ul>
                                            
                                            {/* Botones de homologación solo para administradores */}
                                            {onApprove && onDisapprove && (
                                                <div className="mt-3 text-end">
                                                    {!isApproved ? (
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => onApprove(combination.id)}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? (
                                                                <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                                                            ) : (
                                                                <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                                                            )}
                                                            Homologar
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => onDisapprove(approval.id)}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? (
                                                                <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                                                            ) : (
                                                                <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
                                                            )}
                                                            Deshomologar
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="text-center">
                <LinkButton onClick={() => window.history.back()} icon={faList} variant="info" size="lg">
                    Volver
                </LinkButton>
            </div>
        </>
    );
};

export default TranslatorProfile;