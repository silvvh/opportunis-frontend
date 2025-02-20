import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [submenuVisible, setSubmenuVisible] = useState(false);

  const toggleSubmenu = () => setSubmenuVisible(!submenuVisible);

  return (
    <header className="py-4 md:py-6">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" title="" className="flex rounded outline-none ">
              <img
                className="w-auto h-8"
                src={require("../../Opportunis.png")}
                alt="Logo"
              />
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="text-gray-900"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? (
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="hidden lg:ml-auto lg:flex lg:items-center lg:space-x-10">
            <Link to="/login">Login</Link>

            <div className="relative">
              <button
                onClick={toggleSubmenu}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl hover:text-[#F7B400]"
              >
                Cadastro
              </button>

              {submenuVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-50 border border-gray-200 rounded-lg shadow-lg">
                  <Link
                    to="/candidate-register"
                    className="block px-4 py-2 text-gray-900 hover:text-[#F7B400]"
                  >
                    Candidato
                  </Link>
                  <Link
                    to="/company-register"
                    className="block px-4 py-2 text-gray-900 hover:text-[#F7B400]"
                  >
                    Empresa
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <nav className="lg:hidden px-1 py-8">
          <div className="grid gap-y-7">
            {["Cadastro (candidato)", "Cadastro (empresa)"].map((item) => (
              <Link
                key={item}
                to={
                  item.includes("candidato")
                    ? "/candidate-register"
                    : "/company-register"
                }
                className="block px-4 py-2 text-gray-900 hover:text-[#F7B400]"
              >
                {item}
              </Link>
            ))}
            <Link className="px-4" to="/login">
              Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
