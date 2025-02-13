import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

// Definir las propiedades del componente
type LinkButtonProps = {
  to?: string; // Ruta a la que redirige el botón (opcional si hay onClick)
  icon?: IconDefinition; // Icono opcional (usando FontAwesome)
  children: React.ReactNode; // Contenido del botón (texto)
  variant?: string; // Variante de estilo del botón (ej: "primary", "success")
  size?: 'lg' | 'sm'; // Tamaño opcional del botón
  className?: string; // Clases CSS adicionales
  onClick?: (e: React.MouseEvent) => void; // Acepta un evento como parámetro
  type?: 'button' | 'submit' | 'reset';
};

// Componente personalizado LinkButton
const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  icon,
  children,
  variant = 'primary',
  size,
  className = '',
  onClick,
  type,
}) => {
  // Si hay un evento onClick, renderizar solo un botón sin enlace
  if (onClick) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={onClick}
        type={type}
      >
        {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
        {children}
      </Button>
    );
  }

  // Si no hay onClick, usar Link para la navegación
  return (
    <Link to={to || '#'} className="text-decoration-none">
      <Button variant={variant} size={size} className={className}>
        {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
        {children}
      </Button>
    </Link>
  );
};

export default LinkButton;
