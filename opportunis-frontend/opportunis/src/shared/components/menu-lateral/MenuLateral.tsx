import {
  Avatar,
  Divider,
  Drawer,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Biblioteca para acessar os cookies
import { EmpresasService } from "../../services/api/empresas/EmpresasService"; // Ajuste conforme sua estrutura

import { useAppThemeContext, useDrawerContext } from "../../contexts";

interface IListItemLinkProps {
  to: string;
  icon: string;
  label: string;
  onClick: (() => void) | undefined;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

export const MenuLateral: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { isDrawerOpen, drawerOptions, toggleDrawerOpen } = useDrawerContext();
  const { toggleTheme } = useAppThemeContext();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const userId = Cookies.get("id");; // Pegando o ID do usuário do cookie
    if (userId) {
      EmpresasService.getById(Number(userId))
        .then((result) => {
          if (result instanceof Error) {
            console.error("Erro ao buscar usuário:", result.message);
          } else {
            setAvatarUrl(result.url_image ?? null); // Ajuste conforme o nome da chave no backend
          }
        })
        .catch((error) => console.error("Erro ao carregar usuário:", error));
    }
  }, []);

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        variant={smDown ? "temporary" : "permanent"}
        onClose={toggleDrawerOpen}
      >
        <Box
          width={theme.spacing(28)}
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Box
            width="100%"
            height={theme.spacing(20)}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              alt="User"
              src={avatarUrl || require("../../../admin.jpg")} // Se não houver foto, usa uma padrão
              sx={{ width: 56, height: 56 }}
            />
          </Box>

          <Divider />

          <Box flex={1}>
            <List component="nav">
              {drawerOptions.map((drawerOption) => (
                <ListItemLink
                  to={drawerOption.path}
                  key={drawerOption.path}
                  icon={drawerOption.icon}
                  label={drawerOption.label}
                  onClick={smDown ? toggleDrawerOpen : undefined}
                />
              ))}
            </List>
          </Box>

          <Box>
            <List component="nav">
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  <Icon>dark_mode</Icon>
                </ListItemIcon>
                <ListItemText primary="Alternar tema" />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};
