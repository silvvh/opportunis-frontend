import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { ICandidatures, VagasService } from "../../shared/services/api/vagas/VagasService";
import { IListagemCandidato, IListagemEmpresa } from "../../shared/services/api/auth/AuthService";
import { IListagemCategory } from "../../shared/services/api/category/CategoryService";
import { MenuLateral } from "../../shared/components";


export interface IListagemVaga {
  id: number;
  goal: string;
  requirements: string;
  description: string;
  wage: number;
  qtdCandidate: number;
  activate: boolean;
  company: IListagemEmpresa;
  candidatures: ICandidatures[];
  category: IListagemCategory;
}


export const ListagemDeCandidatosVaga: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [candidatures, setCandidatures] = useState<ICandidatures[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  

  // Recupera o ID da vaga da query string
  const vagaId = searchParams.get("vagaId");

  useEffect(() => {
    if (!vagaId) {
      alert("ID da vaga não foi informado!");
      navigate("/company-dashboard");
      return;
    }

    setIsLoading(true);

    VagasService.getById(Number(vagaId)).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        
        setCandidatures(result.candidatures || []);
      }
    });
  }, [vagaId, navigate]);

  return (
  <MenuLateral>
    <LayoutBaseDePagina titulo="Candidatos">
      <div className="m-4 rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-center p-4">Carregando...</p>
          ) : candidatures.length > 0 ? (
            <table className="min-w-full bg-white">
              <thead className="bg-black text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Telefone</th>
                  <th className="py-3 px-4 text-left">CPF</th>
                  <th className="py-3 px-4 text-left">Gênero</th>
                </tr>
              </thead>
              <tbody>
                {candidatures.map((candidature, index) => {
                  const candidate = candidature.candidate;
                  console.log(candidature.candidate);

                  if (!candidate) {
                    console.warn(`Candidature sem candidato no índice ${index}`);
                    return null; // Ignora essa linha no mapa
                  }

                  return (
                    <tr
                      key={candidate.id || index} // Converte para string como fallback
                      className="border-t border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-4">{candidate.name}</td>
                      <td className="py-3 px-4">{candidate.email}</td>
                      <td className="py-3 px-4">{candidate.telephone}</td>
                      <td className="py-3 px-4">{candidate.genre}</td>
                    </tr>
                  );
                })}
              </tbody>


            </table>
          ) : (
            <p className="text-center p-4">Nenhum candidato encontrado para esta vaga.</p>
          )}
        </div>
      </div>
    </LayoutBaseDePagina>
  </MenuLateral>
  );
};

