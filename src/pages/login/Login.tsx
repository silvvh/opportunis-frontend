// src/components/Login.jsx

import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../shared/services/api/auth/AuthService";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa os erros antes de validar

    if (!isValidEmail(email)) {
      setError("O email está em um formato inválido.");
      return;
    }

    if (!password) {
      setError("A senha não pode estar vazia.");
      return;
    }

    AuthService.login({ email, password }).then(
      (result: { id: string; role: any; token: any; message: any }) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          Cookies.set("token", result.token, {
            sameSite: "None",
            secure: true,
            expires: 7,
          });
          Cookies.set("role", result.role);
          Cookies.set("id", result.id);
          console.debug(result);
          switch (result.role) {
            case "CANDIDATE":
              navigate(`/candidate-dashboard`);
              break;
            case "ENTERPRISE":
              navigate(`/company-dashboard`);
              break;
            case "ADMIN":
              navigate(`/admin-dashboard/candidatos`);
              break;
          }
        }
      }
    );
  };

  return (
    <>
      <header className="pt-4 md:pt-6 bg-gray-100">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link to="/" title="" className="flex rounded outline-none">
                <img
                  className="w-auto h-8"
                  src={require("../../Opportunis.png")}
                  alt="Logo"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6">
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Endereço de email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="flex justify-between text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="Senha"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:text-[#F7B400]"
            >
              Entrar
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Esqueceu sua senha?{" "}
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Clique aqui
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
