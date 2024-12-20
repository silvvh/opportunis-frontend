
import { Routes, Route, Navigate } from "react-router-dom";

import { ListagemDeCandidatos } from "../pages";
import { DetalheDeCandidatos } from "../pages/candidato/DetalheDeCandidatos";
import Home from "../pages/home/Home";
import CompanyRegister from "../pages/register/CompanyRegister";
import CandidateRegister from "../pages/register/CandidateRegister";
import Login from "../pages/login/Login";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import { ListagemDeEmpresas } from "../pages/empresa/ListagemDeEmpresas";
import { DetalheDeEmpresas } from "../pages/empresa/DetalheDeEmpresas";
import CompanyDashboard from "../pages/dashboard/CompanyDashboard";
import CandidateDashboard from "../pages/dashboard/CandidateDashboard";
//import { Perfil } from "../pages/candidato/Perfil";
//import Curriculum from "../pages/candidato/Curriculum";
import DetalheDeVagas from "../pages/vagas/DetalheDeVagas";
import { EditCompany } from "../pages/dashboard/EditCompany";
import { ListagemDeCandidatosVaga } from "../pages/vagas/ListagemDeCandidatosVaga";
//import { ListagemDeCandidatosVaga } from "../pages/vagas/ListagemDeCandidatosVaga";
/*<Route path="profile" element={<Perfil />} />
<Route path="curriculum" element={<Curriculum />} />
<Route path="/vacancies-candidate" element={<ListagemDeCandidatosVaga/>} />*/
export const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />}>
        <Route path="candidatos" element={<ListagemDeCandidatos />} />
        <Route path="candidato/:id" element={<DetalheDeCandidatos />} />
        <Route path="empresas" element={<ListagemDeEmpresas />} />
        <Route path="empresa/:id" element={<DetalheDeEmpresas />} />
      </Route>
      <Route path="/company-dashboard" element={<CompanyDashboard />} />
      <Route path="/candidate-dashboard" element={<CandidateDashboard />}>

      </Route>
      <Route path="/vacancies/:id" element={<DetalheDeVagas />} />
      <Route path="/vacancies-candidate" element={<ListagemDeCandidatosVaga/>} />
      <Route path="/company-edit" element={<EditCompany />} />
      <Route path="/company-register" element={<CompanyRegister />} />
      <Route path="/candidate-register" element={<CandidateRegister />} />
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};