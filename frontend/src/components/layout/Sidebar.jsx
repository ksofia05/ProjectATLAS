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
    <aside className="fixed left-0 top-0 bg-gradient-to-l from-[#181825] via-[#181825] to-[#14141e] backdrop-blur-sm text-white w-72 h-screen flex flex-col justify-between py-8 px-6 shadow-lg border-r border-slate-700/50 overflow-y-auto z-40">
      <div>
        {showLogo && (
          <div className="flex items-center gap-3 mb-10">
            <img
              src={logo}
              alt="Logo ATLAS"
              className="w-12 h-12 object-contain"
            />
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
                const isDashboard = item.label === "Dashboard";
                const isActive = isDashboard
                  ? location.pathname === item.to
                  : location.pathname === item.to ||
                    location.pathname.startsWith(item.to + "/");

                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-purple-600"
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
            <Link
              to="/politica-de-privacidad"
              className="underline hover:text-[#7c2ae8]"
            >
              Políticas de Privacidad
            </Link>
          </div>
          <div>
            <Link
              to="/sobre-nosotros"
              className="underline hover:text-[#7c2ae8]"
            >
              Acerca de nosotros
            </Link>
          </div>
        </footer>
      )}
    </aside>
  );
};

export default Sidebar;
