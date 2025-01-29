import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SQLQueryForm from './components/SQLQueryForm';
import QueryList from './components/QueryList';
import QueryResults from './components/QueryResults';
import Navbar from './components/Navbar';
import WelcomeSection from './components/WelcomeSection';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Container className="mt-5">
        <Routes>
          <Route path="/" element={<WelcomeSection />} />
          <Route path="/query_form" element={<SQLQueryForm />} />
          <Route path="/list_queries" element={<QueryList />} />
          <Route path="/query_results/:queryId?" element={<QueryResults />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;