// react-bootstrap.d.ts
import 'react-bootstrap';

declare module 'react-bootstrap' {
  interface ButtonProps {
    size?: 'sm' | 'lg' | string; // Permitir cadenas en `size`
  }
}