import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  IListagemCategory,
  CategoryService,
} from "../../shared/services/api/category/CategoryService";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe, MenuLateral } from "../../shared/components";
import { useNavigate, useParams } from "react-router-dom";
import { IListagemEmpresa } from "../../shared/services/api/auth/AuthService";
import { VagasService } from "../../shared/services/api/vagas/VagasServie";
const DetalheDeVagas = () => {
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [requirements, setRequirements] = useState("");
  const [description, setDescription] = useState("");
  const [wage, setWage] = useState(0);
  const [qtdCandidate, setQtdCandidate] = useState(0);
  const [activate, setActivate] = useState(true);
  const [categoryId, setCategoryId] = useState(0);
  const [companyId, setCompanyId] = useState(0);
  const [categories, setCategories] = useState<IListagemCategory[]>([]);
  const [company, setCompany] = useState<IListagemEmpresa[]>([]);
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
  const handleSubmit = () => {
    const novaVaga = {
      goal,
      requirements,
      description,
      wage,
      qtdCandidate,
      activate,
      category: { id: categoryId }, // Passando o ID dentro de um objeto
      company: { id: companyId }, // Passando o ID dentro de um objeto
    };

    VagasService.create(novaVaga).then((result) => {
      if (result instanceof Error) {
        alert("Erro ao criar vaga: " + result.message);
      } else {
        alert("Vaga criada com sucesso!");
      }
    });
  };

  return (
    <MenuLateral>
      <LayoutBaseDePagina
        titulo={id === "nova" ? "Nova vaga" : ""}
        barraDeFerramentas={
          <FerramentasDeDetalhe
            textoBotaoNovo="Nova"
            mostrarBotaoNovo={id !== "nova"}
            mostrarBotaoApagar={id !== "nova"}
            aoClicarEmVoltar={() => navigate("/company-dashboard")}
            aoClicarEmSalvar={() => handleSubmit}
            aoClicarEmNovo={() => navigate("/vacancies/nova")}
            aoClicarEmSalvarEFechar={() => handleSubmit}
          />
        }
      >
        <Box p={4}>
          <TextField
            label="Objetivo da vaga"
            fullWidth
            margin="normal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <TextField
            label="Requisitos"
            fullWidth
            margin="normal"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Salário"
            fullWidth
            margin="normal"
            type="number"
            value={wage}
            onChange={(e) => setWage(Number(e.target.value))}
          />
          <TextField
            label="Quantidade de Candidatos"
            fullWidth
            margin="normal"
            type="number"
            value={qtdCandidate}
            onChange={(e) => setQtdCandidate(Number(e.target.value))}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))} // Conversão para número
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Empresa"
            fullWidth
            margin="normal"
            value={companyId}
            onChange={(e) => setCompanyId(Number(e.target.value))}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Cadastrar Vaga
          </Button>
        </Box>
      </LayoutBaseDePagina>
    </MenuLateral>
  );
};
export default DetalheDeVagas;
