import { MdStorefront } from "react-icons/md";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MdStorefront className="text-blue-400 text-2xl" />
              <span className="text-white text-xl font-bold">MarketNest</span>
            </div>
            <p className="text-sm leading-relaxed">
              La plataforma para que tu negocio llegue a más personas. Crea tu
              tienda y empieza a vender hoy.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/stores"
                  className="hover:text-white transition-colors"
                >
                  Tiendas
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-white transition-colors"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-white transition-colors"
                >
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-medium mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>soporte@marketnest.com</li>
              <li>Santa Marta, Colombia</li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mt-10 mb-6" />
        <p className="text-center text-sm">
          © {new Date().getFullYear()} MarketNest. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
