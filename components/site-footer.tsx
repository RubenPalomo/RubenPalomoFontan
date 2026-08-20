import { CurrentYear } from "./current-year";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <a className="footer-brand" href="#inicio">
            Rubén Palomo
          </a>
          <p>Soluciones digitales sencillas para autónomos y empresas.</p>
        </div>
        <div className="footer-links">
          <a href="#servicios">Qué puedo hacer</a>
          <a href="#newsletter">Newsletter</a>
          <a href="#contacto">Contacto</a>
          <a href="/cookies">Cookies</a>
        </div>
        <p className="copyright">
          © <CurrentYear /> Rubén Palomo
        </p>
      </div>
    </footer>
  );
}
