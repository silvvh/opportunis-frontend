import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VagasService } from "../../shared/services/api/vagas/VagasService";
import { IListagemCandidato, IListagemEmpresa } from "../../shared/services/api/auth/AuthService";
import { IListagemCategory } from "../../shared/services/api/category/CategoryService";
import { MenuLateral } from "../../shared/components";
import { CandidatureService, IDetalheCandidature } from "../../shared/services/api/candidature/CandidatureService";
import { CandidatosService, IDetalheCandidato } from "../../shared/services/api/candidatos/CandidatosService";

export const ListagemDeCandidatosVaga: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [candidatur, setCandidatures] = useState<IDetalheCandidature[]>([]);
  const [candidates, setCandidates] = useState<IDetalheCandidato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [candidateIds, setCandidateIds] = useState<number[]>([]);

  

  // Recupera o ID da vaga da query string
  const vagaId = searchParams.get("vagaId");

  useEffect(() => {
    const fetchCandidateIds = async () => {
      setIsLoading(true);

      const result = await CandidatureService.getCandidateIdsByVacancyId(Number(vagaId));
      if (!(result instanceof Error)) {
        setCandidateIds(result);
      } else {
        console.error(result.message);
      }

      setIsLoading(false);
    };

    fetchCandidateIds();
  }, [vagaId]);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);

      const fetchedCandidates: IDetalheCandidato[] = [];
      for (const id of candidateIds) {
        const result = await CandidatosService.getById(id);
        if (!(result instanceof Error)) {
          fetchedCandidates.push(result);
        } else {
          console.error(`Erro ao buscar candidato com ID ${id}:`, result.message);
        }
      }

      setCandidates(fetchedCandidates);
      setIsLoading(false);
    };

    fetchCandidates();
  }, [candidateIds]);

  return (
  <MenuLateral>
    <LayoutBaseDePagina titulo="Candidatos">
      <div className="m-4 rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-center p-4">Carregando...</p>
          ) : candidates.length > 0 ? (
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
              {candidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-t border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-4">{candidate.name}</td>
                      <td className="py-3 px-4">{candidate.email}</td>
                      <td className="py-3 px-4">{candidate.telephone}</td>
                      <td className="py-3 px-4">{candidate.cpf}</td>
                      <td className="py-3 px-4">{candidate.genre}</td>
                    </tr>
                  ))}
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
