import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface IDrawerOption {
  icon: string;
  path: string;
  label: string;
}

interface IDrawerContextData {
  isDrawerOpen: boolean;
  toggleDrawerOpen: () => void;
  drawerOptions: IDrawerOption[];
  setDrawerOptions: (newDrawerOptions: IDrawerOption[]) => void;
}

const DrawerContext = createContext({} as IDrawerContextData);

export const useDrawerContext = () => {
  return useContext(DrawerContext);
};

export const DrawerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [drawerOptions, setDrawerOptionsState] = useState<IDrawerOption[]>(() => {
    // Restaura as opções do localStorage ao inicializar
    const savedOptions = localStorage.getItem("drawerOptions");
    return savedOptions ? JSON.parse(savedOptions) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen((oldDrawerOpen) => !oldDrawerOpen);
  }, []);

  const setDrawerOptions = useCallback((newDrawerOptions: IDrawerOption[]) => {
    setDrawerOptionsState(newDrawerOptions);
    localStorage.setItem("drawerOptions", JSON.stringify(newDrawerOptions)); // Persiste as opções no localStorage
  }, []);

  useEffect(() => {
    // Sincroniza alterações no estado para o localStorage
    localStorage.setItem("drawerOptions", JSON.stringify(drawerOptions));
  }, [drawerOptions]);

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        toggleDrawerOpen,
        drawerOptions,
        setDrawerOptions,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
  