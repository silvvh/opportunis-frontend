/* eslint-disable no-restricted-globals */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import { EmpresasService } from "../../shared/services/api/empresas/EmpresasService";
import { FerramentasDeDetalhe, MenuLateral } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VTextField } from "../../shared/forms";
import Cookies from "js-cookie";

// Atualização da interface de dados do formulário
interface IFormData {
  name: string;
  email: string;
  telephone: string;
  cnpj: string;
  password: string;
  nacionality?: string | null;
  qtd_employee?: number | null;
  site?: string | null;
  social_name?: string | null;
  category_id?: number | null;
}

export const EditCompany: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");
  const companyId = Cookies.get("id");

  useEffect(() => {

    EmpresasService.getById(Number(companyId)).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
        navigate("/company-dashboard");
      } else {
        setNome(result.name);
        formRef.current?.setData(result); // Preenche os dados no formulário
      }
    });
  }, [id, navigate]);

  const handleSave = (dados: IFormData) => {
    setIsLoading(true);

    EmpresasService.updateById(Number(companyId), {
      id: Number(companyId),
      ...dados, // Envia todos os dados
      password: "", // Você pode querer limpar a senha se for um campo opcional
    }).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        alert("Dados atualizados com sucesso!");
        navigate("/company-dashboard");
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Realmente deseja apagar?")) {
      EmpresasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/company-dashboard");
        }
      });
    }
  };

  return (
    <MenuLateral>
      <Box
        margin={1}
        display="flex"
        flexDirection="column"
        component={Paper}
        variant="outlined"
        sx={{
          maxWidth: "100%", // Limita a largura ao tamanho da tela
          height: "calc(100vh - 16px)", // Ocupa a altura da viewport, descontando margens
          overflow: "hidden", // Remove scrolls extras
          boxSizing: "border-box", // Inclui padding e borda no tamanho
        }}
      >
        <Form
          ref={formRef}
          onSubmit={handleSave}
          style={{
            height: "100%", // Garante que o formulário ocupe todo o espaço disponível
          }} 
          placeholder={undefined} 
          onPointerEnterCapture={undefined} 
          onPointerLeaveCapture={undefined}        >
          {/* Cabeçalho do formulário */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={2}
            borderBottom="1px solid #e0e0e0"
            sx={{
              flexShrink: 0, // Impede que o cabeçalho seja redimensionado
            }}
          >
            <Typography variant="h6">Altere seus Dados</Typography>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#ffd600",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              disabled={isLoading}
            >
              Salvar
            </button>
          </Box>

          {/* Conteúdo do formulário */}
          <Box
            padding={2}
            overflow="auto" // Permite scroll apenas para o conteúdo principal se necessário
            sx={{
              height: "calc(100% - 56px)", // Subtrai a altura do cabeçalho do total
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name="name"
                  label="Nome"
                  disabled={isLoading}
                  onChange={(e) => setNome(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name="email"
                  label="Email"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name="telephone"
                  label="Telefone"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name="cnpj"
                  label="CNPJ"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name="nationality"
                  label="Nacionalidade"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name="qtdEmployee"
                  label="Quantidade de Funcionários"
                  type="number"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name="site"
                  label="Site"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Box>
        </Form>
      </Box>
    </MenuLateral>

  );
};