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
  refreshProjects=0,
  isOpen = false,
  onClose,
}) => {
  React.useEffect(() => {
    console.log("Refresh projects:", refreshProjects);
  }, [refreshProjects]);

  const location = useLocation();

  return (
    <>
      {/* Overlay para móvil y tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bg-gradient-to-r from-[#14141e] to-[#14141e] via-[#181825] backdrop-blur-sm text-white w-72 h-screen flex flex-col justify-between py-8 px-6 shadow-lg border-r border-slate-700/50 overflow-y-auto z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <div className="mt-8 lg:mt-0">
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
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-purple-600"
                        }`}
                      >
                        {item.icon && (
                          <i className={item.icon + " text-xl"}></i>
                        )}
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
          <footer className="text-xs text-gray-500 border-t border-gray-700/50 pt-4 relative z-10">
            <div className="mb-3 text-center">
              <span className="text-purple-400 font-medium">
                &copy; 2025 AtlasCo.
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                to="/terminos"
                className="hover:text-purple-400 transition-colors cursor-pointer"
                onClick={onClose}
              >
                Términos
              </Link>
              <span>•</span>
              <Link
                to="/politica-de-privacidad"
                className="hover:text-purple-400 transition-colors cursor-pointer"
                onClick={onClose}
              >
                Privacidad
              </Link>
              <span>•</span>
              <Link
                to="/sobre-nosotros"
                className="hover:text-purple-400 transition-colors cursor-pointer"
                onClick={onClose}
              >
                Acerca de
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
