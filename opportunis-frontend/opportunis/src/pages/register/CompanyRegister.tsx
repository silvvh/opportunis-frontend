import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../shared/services/api/auth/AuthService";
import {
  IListagemCategory,
  CategoryService,
} from "../../shared/services/api/category/CategoryService";

const CompanyRegister: React.FC = () => {
  interface FormData {
    name: string;
    email: string;
    telephone: string;
    password: string;
    cnpj: string;
    category: {id : number};
    url_image: string; // Novo campo para armazenar a URL da imagem
    role: "ENTERPRISE";
  }

  interface Errors {
    name?: string;
    email?: string;
    password?: string;
    telephone?: string;
    cnpj?: string;
    category?: {id : number};
    url_image?: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    telephone: "",
    cnpj: "",
    category: {id : 0},
    url_image: "", // Inicializado como string vazia
    role: "ENTERPRISE",
  });

  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();
  const [categories, setCategories] = useState<IListagemCategory[]>([]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    if (name === "category") {
      setFormData({ ...formData, category: { id: Number(value) } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file); // Cria um link local temporário
      setFormData({ ...formData, url_image: localUrl }); // Salva a URL no estado
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,11}$/;
    const cnpjRegex = /^\d{14}$/;

    if (!formData.name.trim()) {
      newErrors.name = "O nome completo é obrigatório.";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Informe um email válido.";
    }
    if (!phoneRegex.test(formData.telephone)) {
      newErrors.telephone = "Informe um telefone válido com 10 ou 11 dígitos.";
    }
    if (!formData.password) {
      newErrors.password = "A senha é obrigatória.";
    }
    if (!cnpjRegex.test(formData.cnpj)) {
      newErrors.cnpj = "Informe um CNPJ válido com 14 dígitos.";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (validateForm()) {
      AuthService.companyRegister(formData).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Empresa criada");
          navigate(`/login`);
        }
      });
    }
  };

  useEffect(() => {
    // Busca as categorias
    CategoryService.getAll().then((result) => {
      if (result instanceof Error) {
        console.error(result.message);
      } else {
        setCategories(result.data);
      }
    });
  }, []);

  return (
    <>
      <header className="py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link to="/" className="flex rounded outline-none">
                <img className="w-auto h-8" src={require("../../Opportunis.png")} alt="Logo" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
          <div className="md:w-2/3 bg-cover bg-center p-8 flex flex-col justify-center text-white">
            <img src={require("../../companyRegister.png")} alt="Logo" />
          </div>

          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Anuncie vagas gratuitamente</h2>
            <p className="text-sm text-gray-600 mb-6">
              Já possui uma conta? <Link to="/login" className="text-blue-500">Login</Link>
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome da empresa"
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
                <input
                  type="text"
                  name="cnpj"
                  placeholder="Informe o CNPJ"
                  maxLength={14}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                />
                {errors.cnpj && (
                  <p className="text-red-500 text-sm">{errors.cnpj}</p>
                )}
              </div>
              <div className="mb-4">
              <select
                name="category"
                className={`w-full bg-white px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.category.id ? "text-black" : "text-gray-400"
                }`}
                value={formData.category.id}
                onChange={handleInputChange}
              >
                <option value="">Selecione a categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category.id}</p>
                )}
              </div>
              {/* Campo para upload de imagem */}
              <div className="mb-4">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.url_image && <p className="text-red-500 text-sm">{errors.url_image}</p>}
              </div>

              {/* Pré-visualização da imagem */}
              {formData.url_image && (
                <div className="mb-4 flex justify-center">
                  <img src={formData.url_image} alt="Pré-visualização" className="w-24 h-24 object-cover rounded-lg shadow-md" />
                </div>
              )}

              <button type="submit" className="w-full bg-[black] text-white py-2 rounded-lg hover:text-[#F7B400]">
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyRegister;
