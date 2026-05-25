import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Componente personalizado LinkButton
const LinkButton = ({ to, icon, children, variant = 'primary', size, className = '', onClick, type, }) => {
    // Si hay un evento onClick, renderizar solo un botón sin enlace
    if (onClick) {
        return (_jsxs(Button, { variant: variant, size: size, className: className, onClick: onClick, type: type, children: [icon && _jsx(FontAwesomeIcon, { icon: icon, className: "me-2" }), children] }));
    }
    // Si no hay onClick, usar Link para la navegación
    return (_jsx(Link, { to: to || '#', className: "text-decoration-none", children: _jsxs(Button, { variant: variant, size: size, className: className, children: [icon && _jsx(FontAwesomeIcon, { icon: icon, className: "me-2" }), children] }) }));
};
export default LinkButton;
