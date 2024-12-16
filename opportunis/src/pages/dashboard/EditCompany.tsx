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

  useEffect(() => {
    if (id !== "novo") {
      setIsLoading(true);

      EmpresasService.getById(Number(id)).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
          navigate("/admin-dashboard/empresas");
        } else {
          setNome(result.name);
          formRef.current?.setData(result); // Preenche os dados no formulário
        }
      });
    }
  }, [id, navigate]);

  const handleSave = (dados: IFormData) => {
    setIsLoading(true);

    EmpresasService.updateById(Number(id), {
      id: Number(id),
      ...dados, // Envia todos os dados
      password: "", // Você pode querer limpar a senha se for um campo opcional
    }).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        alert("Dados atualizados com sucesso!");
        navigate("/admin-dashboard/empresas");
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
          navigate("/admin-dashboard/empresas");
        }
      });
    }
  };

  return (
    <MenuLateral>  
      <LayoutBaseDePagina
        titulo={id === "novo" ? "Nova empresa" : nome}
        barraDeFerramentas={
          <FerramentasDeDetalhe
            textoBotaoNovo="Novo"
            mostrarBotaoNovo={id !== "novo"}
            mostrarBotaoApagar={id !== "novo"}
            aoClicarEmVoltar={() => navigate("/company-dashboard")}
            aoClicarEmApagar={() => handleDelete(Number(id))}
            aoClicarEmSalvar={() => formRef.current?.submitForm()}
            aoClicarEmNovo={() => navigate("/admin-dashboard/empresa/novo")}
          />
        }
      >
        <Form
            ref={formRef}
            onSubmit={handleSave}
            placeholder={undefined} // Resolve o problema do placeholder
            onPointerEnterCapture={undefined} // Resolve o problema do onPointerEnterCapture
            onPointerLeaveCapture={undefined} // Resolve o problema do onPointerLeaveCapture
          >
          <Box
            margin={1}
            display="flex"
            flexDirection="column"
            component={Paper}
            variant="outlined"
          >
            <Grid container direction="column" padding={2} spacing={2}>
              {isLoading && (
                <Grid item>
                  <LinearProgress variant="indeterminate" />
                </Grid>
              )}

              <Grid item>
                <Typography variant="h6">Atualize as Informações de sua empresa</Typography>
              </Grid>

              {/* Campos do formulário para edição */}
              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name="name"
                    label="Nome"
                    disabled={isLoading}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name="email"
                    label="Email"
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name="telephone"
                    label="Telefone"
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name="cnpj"
                    label="CNPJ"
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>

              {/* Campos adicionais */}
              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name="nacionality"
                    label="Nacionalidade"
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name="qtd_employee"
                    label="Quantidade de Funcionários"
                    type="number"
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name="site"
                    label="Site"
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Form>
      </LayoutBaseDePagina>
    </MenuLateral>
  );
};
