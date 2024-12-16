import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const CandidateDashboard = () => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  if (!token || role !== "CANDIDATE") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-1 bg-gray-50">
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

          <div className="flex flex-col flex-1 px-3 mt-6">
            <div className="space-y-4">
              <nav className="flex-1 space-y-2"></nav>

              <hr className="border-gray-200" />
            </div>
          </div>
        </div>
      </div>

      <div>{"Em construção: " + Cookies.get("role")}</div>
    </div>
  );
};

export default CandidateDashboard;
