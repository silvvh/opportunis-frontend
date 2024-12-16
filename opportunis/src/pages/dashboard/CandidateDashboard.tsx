import React from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { ExitToApp, ManageAccounts, Article, Work } from "@mui/icons-material";

const CandidateDashboard = () => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");
  const id = Cookies.get("id");
  console.debug(id);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("id");
    navigate("/");
  };

  const getButtonStyles = (isActive: boolean) => {
    return isActive
      ? "bg-black text-white hover:text-[#f8b503]"
      : "text-gray-900 hover:bg-[#f8b503] hover:text-white";
  };

  if (!token || role !== "CANDIDATE") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-1 bg-gray-50">
      {/* Painel lateral */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-gray-100">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="w-auto h-8"
              src={require("../../Opportunis.png")}
              alt=""
            />
          </div>

          <div className="px-4 mt-6">
            <hr className="border-gray-200" />
          </div>

          <div className="space-y-4">
            <nav className="flex-1 space-y-2">
              <Link
                to="/candidate-dashboard/profile"
                className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${getButtonStyles(
                  location.pathname.includes("/candidate-dashboard/profile")
                )}`}
              >
                <ManageAccounts
                  className={`flex-shrink-0 mr-4 w-6 h-6 ${
                    location.pathname.includes("candidate-dashboard/profile")
                      ? "text-white"
                      : "text-black"
                  }`}
                />
                Perfil
              </Link>
              <Link
                to="/candidate-dashboard/curriculum"
                className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${getButtonStyles(
                  location.pathname.includes("/candidate-dashboard/curriculum")
                )}`}
              >
                <Article
                  className={`flex-shrink-0 mr-4 w-6 h-6 ${
                    location.pathname.includes(
                      "/candidate-dashboard/curriculum"
                    )
                      ? "text-white"
                      : "text-black"
                  }`}
                />
                Currículo
              </Link>
              <Link
                to="/admin-dashboard/empresas"
                className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${getButtonStyles(
                  location.pathname.includes("/admin-dashboard/empresas")
                )}`}
              >
                <Work
                  className={`flex-shrink-0 mr-4 w-6 h-6 ${
                    location.pathname.includes("/admin-dashboard/empresas")
                      ? "text-white"
                      : "text-black"
                  }`}
                />
                Vagas
              </Link>
            </nav>

            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${getButtonStyles(
                false
              )}`}
            >
              <ExitToApp className="flex-shrink-0 mr-4 w-6 h-6" />
              Logout
            </button>

            <hr className="border-gray-200" />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <main>
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;
