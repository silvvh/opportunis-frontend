import { Api } from "../axios-config";
import { Environment } from "../../../environment";


export interface IDetalheCandidature {
    id: {
      candidate: {
        id: number;
      };
      vacancy: {
        id: number;
      };
    };
    date: string | null; // Assume-se que a data será representada como string no formato ISO ou poderá ser null
}

const create = async (
  dados: IDetalheCandidature
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheCandidature>("/candidatures", dados);

    if (data) {
      return data.id.candidate.id;
    }

    return new Error("Erro ao criar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao criar o registro."
    );
  }
};

const getCandidateIdsByVacancyId = async (
    vacancyId: number
  ): Promise<number[] | Error> => {
    try {
      const { data } = await Api.get<IDetalheCandidature[]>(
        `/candidatures/vacancy/${vacancyId}`
      );
  
      if (Array.isArray(data)) {
        // Extrai apenas os IDs dos candidatos
        return data.map((candidature) => candidature.id.candidate.id);
      }
  
      return new Error("Resposta inválida do servidor.");
    } catch (error) {
      console.error(error);
      return new Error(
        (error as { message: string }).message || "Erro ao buscar candidaturas."
      );
    }
  };


export const CandidatureService = {
  //getAll,
  create,
  getCandidateIdsByVacancyId
  //getById,
  //updateById,
  //deleteById,
};
