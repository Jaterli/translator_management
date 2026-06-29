const Footer = () => {
  return (
    <footer className="footer mt-4">
      <div className="container-xxl">
        <div className="row align-items-center gy-3">
          {/* Logo */}
          <div className="col-md-3 text-center text-md-start">
            <img 
              src="/images/Logo-jtl.png" 
              alt="Logotipo de Jaterli" 
              className="footer-logo"
              height="75"
            />
          </div>

          {/* Copyright y amor */}
          <div className="col-md-5 text-center">
            <p className="mb-0 footer-text">
              Aplicación creada con <span className="footer-heart">❤️</span> por 
              <strong className="footer-brand"> Jaterli</strong>
            </p>
            <p className="footer-copyright mb-0">
              &copy; {new Date().getFullYear()} Jaterli. Todos los derechos reservados.
            </p>
          </div>

          {/* Enlaces sociales */}
          <div className="col-md-4 text-center text-md-end">
            <div className="footer-links">
              <a 
                href="https://github.com/Jaterli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
              >
                <span>GitHub</span>
              </a>
              <a 
                href="https://jaterli.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
              >
                <span>Blog</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;