import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SQLQueryForm from './pages/SQLQueryForm';
import QueryList from './pages/QueryList.tsx';
import QueryResults from './pages/QueryResults';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Footer from "./components/Footer.tsx";
import TranslatorDetail from './pages/TranslatorDetail.tsx';
import LandingPage from './pages/LandingPage.tsx';
import ApprovedCombinations from './pages/ApprovedCombinations.tsx';


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
          <div className="container-xxl flex-grow-1 mt-5">
          <Routes>
            <Route path="/" element={<LandingPage />} />   
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/query-form" element={<PrivateRoute><SQLQueryForm /></PrivateRoute>} />
            <Route path="/list-queries" element={<PrivateRoute><QueryList /></PrivateRoute>} />
            <Route path="/query-results/:queryId?" element={<PrivateRoute><QueryResults /></PrivateRoute>} />
            <Route path="/translator-detail/:id" element={<PrivateRoute><TranslatorDetail /></PrivateRoute> } />            
            <Route path="/approved-combinations" element={<PrivateRoute><ApprovedCombinations /></PrivateRoute>} />            
          </Routes>
          </div>
          <Footer />        
      </Router>
    </AuthProvider>
  );
};

export default App;