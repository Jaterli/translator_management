import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SQLQueryForm from './pages/SQLQueryForm';
import QueryList from './pages/QueryList';
import QueryResults from './pages/QueryResults';
import Navbar from './components/Navbar';
import WelcomeSection from './pages/Dashboard';
import { Container } from 'react-bootstrap';

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