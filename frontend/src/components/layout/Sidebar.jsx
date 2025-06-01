import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/LogoTransparente.png";

const Sidebar = ({
  showLogo = true,
  menuItems = [],
  showProjectsBlock = false,
  projectsBlock = null,
  footerLinks = true,
  children,
}) => {
  const location = useLocation();

  return (
    <aside className="bg-gradient-to-l from-[#181825] via-[#181825] to-[#14141e] text-white w-72 min-h-screen flex flex-col justify-between py-8 px-6">
      <div>
        {showLogo && (
          <div className="flex items-center gap-3 mb-10">
            <img src={logo} alt="Logo ATLAS" className="w-12 h-12 object-contain" />
            <span className="text-3xl font-bold tracking-wide">ATLAS</span>
          </div>
        )}

        {showProjectsBlock && (
          <div className="font-medium text-gray-300">{projectsBlock}</div>
        )}

        {menuItems.length > 0 && (
          <nav>
            <ul className="flex flex-col gap-2">
              {menuItems.map((item) => {
                // Determina si el ítem está activo
                const isActive = item.to === "/dashboard"
                  ? (
                      location.pathname === "/dashboard" ||
                      /^\/dashboard\/\d+$/.test(location.pathname)
                    )
                  : location.pathname.startsWith(item.to);

                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? "bg-[#232336] text-white"
                          : "text-gray-300 hover:bg-[#232336] hover:text-white"
                      }`}
                    >
                      {item.icon && <i className={item.icon + " text-xl"}></i>}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {children}
      </div>

      {footerLinks && (
        <footer className="text-xs text-gray-500">
          <div className="mb-2">&copy; 2025 AtlasCo.</div>
          <div>
            <Link to="/terminos" className="underline hover:text-[#7c2ae8]">
              Términos de Servicio
            </Link>
            {" y "}
            <Link to="/politica-de-privacidad" className="underline hover:text-[#7c2ae8]">
              Políticas de Privacidad
            </Link>
          </div>
          <div>
            <Link to="/sobre-nosotros" className="underline hover:text-[#7c2ae8]">
              Acerca de nosotros
            </Link>
          </div>
        </footer>
      )}
    </aside>
  );
};

export default Sidebar;