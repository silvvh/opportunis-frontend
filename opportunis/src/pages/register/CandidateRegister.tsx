import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../shared/services/api/auth/AuthService";

const CandidateRegister: React.FC = () => {
  interface FormData {
    role: "CANDIDATE";
    name: string;
    email: string;
    password: string;
    telephone: string;
    genre: string;
    cpf: string;
  }

  interface Errors {
    name?: string;
    email?: string;
    password?: string;
    telephone?: string;
    genre?: string;
    cpf?: string;
  }
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    telephone: "",
    genre: "",
    cpf: "",
    role: "CANDIDATE",
  });
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const cpfRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,11}$/;

    if (!formData.name.trim()) {
      newErrors.name = "O nome completo é obrigatório.";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Informe um email válido.";
    }
    if (!cpfRegex.test(formData.cpf)) {
      newErrors.cpf = "Informe um CPF válido com 11 dígitos.";
    }
    if (!phoneRegex.test(formData.telephone)) {
      newErrors.telephone = "Informe um telefone válido com 10 ou 11 dígitos.";
    }
    if (!formData.password) {
      newErrors.password = "A senha é obrigatória.";
    }
    if (!formData.genre) {
      newErrors.genre = "Selecione um gênero.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      AuthService.candidateRegister(formData).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Usuário criado");
          navigate(`/login`);
        }
      });
    }
  };

  return (
    <>
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
          </div>
        </div>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
          <div className="md:w-2/3 bg-cover bg-center p-8 flex flex-col justify-center text-white">
            <img src={require("../../Interview.png")} alt="Logo" />
          </div>

          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-nowrap">
              Cadastre-se e garanta sua vaga
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Já possui uma conta?{" "}
              <Link to="/login" className="text-blue-500">
                Login
              </Link>
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Informe seu nome completo"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Informe seu email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Informe sua senha"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Informe seu telefone"
                  maxLength={11}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.telephone}
                  onChange={handleInputChange}
                />
                {errors.telephone && (
                  <p className="text-red-500 text-sm">{errors.telephone}</p>
                )}
              </div>
              <div className="mb-4">
                <select
                  name="genre"
                  className={`w-full bg-white px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.genre ? "text-black" : "text-gray-400"
                  }`}
                  value={formData.genre}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Selecione seu gênero
                  </option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option>Prefiro não dizer</option>
                </select>
                {errors.genre && (
                  <p className="text-red-500 text-sm">{errors.genre}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="cpf"
                  placeholder="Informe seu CPF"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cpf}
                  onChange={handleInputChange}
                />
                {errors.cpf && (
                  <p className="text-red-500 text-sm">{errors.cpf}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[black] text-white py-2 rounded-lg hover:text-[#F7B400]"
              >
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateRegister;
