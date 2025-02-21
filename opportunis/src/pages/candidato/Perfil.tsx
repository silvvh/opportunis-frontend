/* eslint-disable no-restricted-globals */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import { EmpresasService } from "../../shared/services/api/empresas/EmpresasService";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VTextField } from "../../shared/forms";
import { CandidatosService } from "../../shared/services/api/candidatos/CandidatosService";
import Cookies from "js-cookie";

interface IFormData {
  name: string;
  email: string;
  telephone: string;
  password: string;
  cpf: string;
  genre: string;
  role: number[];
}

export const Perfil: React.FC = () => {
  const id = Cookies.get("id");
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (id !== "novo") {
      setIsLoading(true);

      CandidatosService.getById(Number(id)).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          setError(true);
          const timer = setTimeout(() => setError(false), 3000);
          navigate("/admin-dashboard/candidatos");
          return () => clearTimeout(timer);
        } else {
          setNome(result.name);
          const formData = { ...result };
          formRef.current?.setData(formData);
        }
      });
    }
  }, [id, navigate, error]);

  const handleSave = (dados: IFormData) => {
    setIsLoading(true);
    CandidatosService.updateById(Number(id), {
      id: Number(id),
      ...dados,
    }).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        setError(true);
        const timer = setTimeout(() => setError(false), 3000);
        return () => clearTimeout(timer);
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Realmente deseja apagar?")) {
      EmpresasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          setError(true);
          const timer = setTimeout(() => setError(false), 3000);
          return () => clearTimeout(timer);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/admin-dashboard/empresas");
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === "novo" ? "Nova empresa" : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo"
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={false}
          aoClicarEmVoltar={() => navigate("/admin-dashboard/empresas")}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmSalvar={() => formRef.current?.submitForm()}
          aoClicarEmNovo={() => navigate("/admin-dashboard/empresa/novo")}
        />
      }
    >
      <Form
        ref={formRef}
        onSubmit={handleSave}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
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
              <Typography variant="h6">Editar perfil</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="name"
                  disabled={isLoading}
                  label="Nome"
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
                  InputProps={{ readOnly: true }}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Telefone"
                  name="telephone"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="cpf"
                  label="CPF"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Form>
      {error && <Alert severity="error">Falha ao salvar</Alert>}
    </LayoutBaseDePagina>
  );
};
