const Footer = () => {
  return (
    <footer className="py-4">
      <div className="container text-center mt-4">
        <img 
          src="/images/Logo-jtl.png" 
          alt="Logotipo de Jaterli" 
          className="img-fluid" 
          style={{ width: "80px" }}
        />
        <p className="mb-0">Aplicación creada por <strong>Jaterli</strong></p>
        <div className="d-flex justify-content-center gap-3">
          <a 
            href="https://github.com/Jaterli" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-decoration-none"
          >
            <i className="bi bi-github"></i> GitHub
          </a>
          <a 
            href="https://jaterli.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-decoration-none"
          >
            <i className="bi bi-globe"></i> Blog Personal
          </a>
        </div>
        <p className="mt-3 text-muted" style={{ fontSize: "0.9rem" }}>
          &copy; {new Date().getFullYear()} Jaterli. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
