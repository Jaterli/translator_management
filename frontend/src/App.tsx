import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SQLQueryForm from './pages/SQLQueryForm';
import QueryList from './pages/QueryList.tsx';
import QueryResults from './pages/QueryResults';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { Container } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Footer from "./components/Footer.tsx";


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container className="mt-5">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/query_form" element={<PrivateRoute><SQLQueryForm /></PrivateRoute>} />
            <Route path="/list_queries" element={<PrivateRoute><QueryList /></PrivateRoute>} />
            <Route path="/query_results/:queryId?" element={<PrivateRoute><QueryResults /></PrivateRoute>} />
          </Routes>
          <Footer />
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;