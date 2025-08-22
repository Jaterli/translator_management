// src/pages/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Button, Form, Container, Card, Alert } from 'react-bootstrap';
import logo from '/images/logo-gc.png'; // Importa la misma imagen del logo

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth(); // Función de login del contexto de autenticación
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Guarda el token y la información del usuario en el contexto de autenticación
      const { access_token, refresh_token = '', user } = await login(username, password);
     
      // Guarda el token en el contexto de autenticación
      authLogin(access_token, refresh_token, user);

      // Redirige al dashboard
      navigate('/');       

    } catch (error) {
      setError('Credenciales inválidas o usuario no autorizado');
      console.error('Login failed', error);
    } 
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo de Gestor de Consultas"
            className="img-fluid"
            style={{ maxHeight: '100px', width: 'auto' }}
          />
        </div>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" size="lg">
              Iniciar sesión
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
