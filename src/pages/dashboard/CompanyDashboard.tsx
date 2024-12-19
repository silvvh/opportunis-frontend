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
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Cancel as CancelIcon } from "@mui/icons-material"; // Importando os ícones
import { useDrawerContext } from "../../shared/contexts";
import { useDebounce } from "../../shared/hooks";
import {
  IListagemVaga,
  VagasService,
} from "../../shared/services/api/vagas/VagasService";

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

  // Configura o menu lateral sempre que o token ou role mudar
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
            const companyId = Number(idCompany);

            // Filtrar vagas ativas e com idCompany válido
            const filteredVagas = result.data.filter(
              (vaga) => vaga.activate && vaga.company.id !== null && vaga.company.id === companyId
            );

            setTotalCount(filteredVagas.length);
            setRows(filteredVagas);
          } else {
            setRows([]); // Caso result.data não seja um array válido
            console.error("Dados de vagas inválidos:", result.data);
          }
        }
      });
    });
  }, [busca, debounce, pagina, idCompany]);

  const handleEdit = (vagaId: number) => {
    // Lógica para editar a vaga
    navigate(`/vacancies/edit/${vagaId}`);
  };

  const handleCancel = (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Realmente deseja cancelar a vaga?")) {
      VagasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setRows((oldRows) => oldRows.filter((oldRow) => oldRow.id !== id));
          alert("Vaga Cancelada com Sucesso!");
        }
      });
    }
  };

  if (!token || role !== "ENTERPRISE") {
    return <Navigate to="/" replace />;
  }

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
                <Card sx={{ position: "relative" }}>
                  {/* Ícones dentro do Card no canto superior direito */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <IconButton color="warning" onClick={() => handleCancel(vaga.id)}>
                      <CancelIcon />
                    </IconButton>
                  </Box>

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
                  {selectedVaga.description || "Descrição não disponível"}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Requisitos: {selectedVaga.requirements || "Não especificados"}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Salário: {selectedVaga.wage > 0 ? `R$ ${selectedVaga.wage}` : "Não informado"}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Categoria: {selectedVaga.category?.name || "Não especificada"}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Empresa: {selectedVaga.company?.name || "Não especificada"}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Quantidade de candidatos:{" "}
                  {Array.isArray(selectedVaga.candidatures)
                    ? selectedVaga.candidatures.reduce((count, _) => count + 1, 0)
                    : 0}
                </Typography>
                {/* Botões no rodapé */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/vacancies-candidate?vagaId=${selectedVaga.id}`)}
                  >
                    Ver Candidatos
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                    Fechar
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </LayoutBaseDePagina>
    </MenuLateral>
  );
};

export default CompanyDashboard;
