import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Button,
  TextField,
  MenuItem,
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
import { VagasService } from "../../shared/services/api/vagas/VagasService";

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
  const [categories, setCategories] = useState<IListagemCategory[]>([]);

  // Obtém o ID da empresa dos cookies
  const companyId = Cookies.get("id");

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
    if (!companyId) {
      alert("ID da empresa não encontrado nos cookies.");
      return;
    }

    const novaVaga = {
      goal,
      requirements,
      description,
      wage,
      qtdCandidate,
      activate,
      category: { id: categoryId }, // Passando o ID dentro de um objeto
      company: { id: Number(companyId) }, // Passando o ID da empresa dos cookies
    };

    VagasService.create(novaVaga).then((result) => {
      if (result instanceof Error) {
        alert("Erro ao criar vaga: " + result.message);
      } else {
        alert("Vaga criada com sucesso!");
        navigate("/company-dashboard");
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
            variant="outlined" // Adicionado para manter o label no topo
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <TextField
            label="Requisitos"
            fullWidth
            margin="normal"
            variant="outlined" // Adicionado para manter o label no topo
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            variant="outlined" // Adicionado para manter o label no topo
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))} // Conversão para número
              label="Categoria"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Salário"
            fullWidth
            margin="normal"
            type="number"
            variant="outlined"
            value={wage}
            onChange={(e) => setWage(Number(e.target.value))}
          />
          <TextField
            label="Quantidade de Candidatos"
            fullWidth
            margin="normal"
            type="number"
            variant="outlined"
            value={qtdCandidate}
            onChange={(e) => setQtdCandidate(Number(e.target.value))}
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
