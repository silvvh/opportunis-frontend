import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import { Dashboard, ListagemDeCandidatos} from '../pages';
import { DetalheDeCandidatos } from '../pages/candidato/DetalheDeCandidatos';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página inicial',
      },
      {
        icon: 'people',
        path: '/candidatos',
        label: 'Candidatos',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      <Route path="/candidatos" element={<ListagemDeCandidatos />} />
      <Route path="/candidatos/detalhe/:id" element={<DetalheDeCandidatos />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
