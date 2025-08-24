import { faPlusCircle, faList } from '@fortawesome/free-solid-svg-icons';
import logo from '/images/logo-gc.png'; // Importa la imagen
import LinkButton from '../components/ui/LinkButton';

const Dashboard: React.FC = () => {

  return (
    <div className="p-3 p-md-5 border rounded-3 bg-body-secondary text-center">
      <div className="text-center">
        <img 
          src={logo} 
          alt="Logo de Gestor de Consultas" 
          className="img-fluid" 
          style={{ maxHeight: "200px", width: "auto" }} 
        />
      </div>
      <h1 className="display-5 display-md-4">Gestor de consultas</h1>
      <p className="lead fs-6 fs-md-4">Administra y guarda tus consultas SQL fácilmente.</p>
      <hr className="my-4" />

      <div className="d-flex flex-column flex-md-row gap-2 justify-content-center mt-4">

        <LinkButton to="/query-form" icon={faPlusCircle} className='w-100 mb-2 mb-md-0' variant="primary" size="lg">
          Crear una consulta
        </LinkButton>
        
        <LinkButton to="list-queries" icon={faList} className='w-100 mb-2 mb-md-0' variant="success" size="lg">
          Listar consultas
        </LinkButton>

        <LinkButton to="query-results" icon={faList} className='w-100' variant="info" size="lg">
          Mostrar resultados
        </LinkButton>

      </div>
    </div>
  );
};

export default Dashboard;