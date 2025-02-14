import React from 'react';
import { Translator } from '../../types/Translator';
import LinkButton from '../ui/LinkButton';
import { faFileAudio, faFilePdf, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TranslatorProfileProps {
    translator: Translator;
}

const TranslatorProfile: React.FC<TranslatorProfileProps> = ({ translator }) => {
    return (
        <><div className="card mb-4 shadow-sm">
            {/* Cabecera de la carta principal */}
            <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-1">{translator.first_name} {translator.last_name}</h5>
                <h6 className="card-subtitle mb-0">{translator.email}</h6>
            </div>
            <div className="card-body">

                {/* Sección de archivos */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        {translator.files.cv_file && (
                            <a href={`${translator.files.cv_file}`} className="btn btn-outline-primary me-2">
                                <FontAwesomeIcon icon={faFilePdf} /> Descargar CV
                            </a>
                        )}
                        {translator.files.voice_note && (
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
                            {translator.professional_profile.native_languages}
                        </p>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <p className="card-text">
                            <strong>Genero:</strong><br />
                            {translator.gender === 'H' ? 'Hombre': translator.gender === 'M' ? 'Mujer' : 'Otro'}
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
                            {translator.professional_profile.education}
                        </p>
                    </div>
                    <div className="col-md-6">
                        <p className="card-text">
                            <strong>Experiencia:</strong><br />
                            {translator.professional_profile.experience}
                        </p>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <p className="card-text">
                            <strong>Software:</strong><br />
                            {translator.professional_profile.softwares}
                        </p>
                    </div>
                </div>                
                {/* Combinaciones de idiomas */}
                <div className="row mt-5">
                    {translator.language_combination.map((combination) => (
                        <div key={combination.id} className="col-md-6 mb-3">
                            <div className="card h-100">
                                {/* Cabecera de la carta secundaria */}
                                <div className="card-header bg-body-secondary px-3 py-2 rounded-top">
                                    <h6 className="card-subtitle mb-0">
                                        <strong>De:</strong> {combination.source_language} <strong>A:</strong> {combination.target_language}
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        <strong>Servicios:</strong> {combination.services}
                                    </p>
                                    <p className="card-text">
                                        <strong>Tipos de texto:</strong> {combination.text_types}
                                    </p>
                                    <p className="card-text">
                                        <strong>Precio por palabra:</strong> {combination.price_per_word} €
                                    </p>
                                    <p className="card-text">
                                        <strong>Precio por palabra jurada:</strong> {combination.sworn_price_per_word || 'No disponible'} €
                                    </p>
                                    <p className="card-text">
                                        <strong>Precio por hora:</strong> {combination.price_per_hour || 'No disponible'} €
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="text-center">
            <LinkButton to="/query_results" icon={faList} variant="info" size="lg">
                Volver a resultados
            </LinkButton>
        </div></>

    );
};

export default TranslatorProfile;