import { CurrentYear } from "./current-year";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <a className="footer-brand" href="#inicio">
            Rubén Palomo
          </a>
          <p>Software, automatización e IA práctica para pequeñas empresas.</p>
        </div>
        <div className="footer-links">
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Cómo trabajo</a>
          <a href="#newsletter">Newsletter</a>
          <a href="#contacto">Contacto</a>
        </div>
        <p className="copyright">
          © <CurrentYear /> Rubén Palomo
        </p>
      </div>
    </footer>
  );
}
