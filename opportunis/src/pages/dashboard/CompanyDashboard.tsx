import React, { useMemo, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDaListagem, MenuLateral } from "../../shared/components";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Modal,
  Box,
} from "@mui/material";
import { useDrawerContext } from "../../shared/contexts";

import { useDebounce } from "../../shared/hooks";
import {
  IListagemVaga,
  VagasService,
} from "../../shared/services/api/vagas/VagasServie";

const CompanyDashboard = () => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");
  const idCompany = Cookies.get("id");
  const { debounce } = useDebounce();
  const [searchParams, setSearchParams] = useSearchParams();
  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemVaga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedVaga, setSelectedVaga] = useState<IListagemVaga | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const pagina = useMemo(
    () => Number(searchParams.get("pagina") || "1"),
    [searchParams]
  );

  const { setDrawerOptions } = useDrawerContext();

  const handleOpenModal = (vaga: IListagemVaga) => {
    setSelectedVaga(vaga);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedVaga(null);
    setOpenModal(false);
  };

  useEffect(() => {
    if (token && role === "ENTERPRISE") {
      setDrawerOptions([
        { path: "/company-dashboard", label: "Início", icon: "home" },
        { path: "/company-dashboard", label: "Vagas", icon: "work" },
        { path: "/company-edit", label: "Minha Empresa", icon: "business" },
      ]);
    }
  }, [token, role, setDrawerOptions]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      VagasService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          if (Array.isArray(result.data)) {
            setTotalCount(result.totalCount);
            setRows(result.data);
          } else {
            setRows([]); // Caso result.data não seja um array válido
            console.error("Dados de vagas inválidos:", result.data);
          }
        }
      });
    });
  }, [busca, debounce, pagina]);

  if (!token || role !== "ENTERPRISE") {
    return <Navigate to="/" replace />;
  }

  console.log(idCompany);
  return (
    <MenuLateral>
      <LayoutBaseDePagina
        titulo="Vagas da Empresa"
        barraDeFerramentas={
          <FerramentasDaListagem
            textoDaBusca={busca}
            textoBotaoNovo="Nova"
            aoClicarEmNovo={() => navigate("/vacancies/nova")}
            aoMudarTextoDeBusca={(texto) =>
              setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
            }
          />
        }
      >
        <Grid container spacing={3}>
          {rows
            .filter((vaga) =>
              vaga.goal.toLowerCase().includes(busca.toLowerCase())
            )
            .map((vaga) => (
              <Grid item xs={12} sm={6} md={4} key={vaga.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{vaga.goal}</Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {vaga.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Empresa: {vaga.company?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Categoria: {vaga.category?.name}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleOpenModal(vaga)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Modal para exibir detalhes */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedVaga && (
              <>
                <Typography variant="h5" gutterBottom>
                  {selectedVaga.goal}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedVaga.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Requisitos: {selectedVaga.requirements}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Salário: {selectedVaga.wage}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Categoria: {selectedVaga.category?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Empresa: {selectedVaga.company?.name}
                </Typography>
                <Button variant="outlined" onClick={handleCloseModal}>
                  Fechar
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </LayoutBaseDePagina>
    </MenuLateral>
  );
};

export default CompanyDashboard;
