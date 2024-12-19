import { Api } from "../axios-config";
import { Environment } from "../../../environment";

import { IListagemEmpresa } from "../empresas/EmpresasService";
import { IListagemCategory } from "../category/CategoryService";
import { IListagemCandidato } from "../candidatos/CandidatosService";

export interface IEmpresa {
  id: number;
}

export interface ICategory {
  id: number;
}

export interface ICandidatures {
  date: Date;
  candidate: IListagemCandidato;
}

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

export interface IDetalheVaga {
  id: number;
  goal: string;
  requirements: string;
  description: string;
  wage: number;
  qtdCandidate: number;
  activate: boolean;
  category: ICategory; // Alterado para um único objeto
  company: IEmpresa; // Alterado para um único objeto
}

type TVagasComTotalCount = {
  data: IListagemVaga[];
  totalCount: number;
};

type TVagaComTotalCount = {
  data: IListagemVaga;
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TVagasComTotalCount | Error> => {
  try {
    const urlRelativa = `/vacancies?page=${page - 1}&size=${
      Environment.LIMITE_DE_LINHAS
    }&name_like=${filter}`;

    const { data } = await Api.get(urlRelativa);

    if (data && data.content) {
      return {
        data: data.content.map((vaga: any) => ({
          id: vaga.id,
          goal: vaga.goal,
          requirements: vaga.requirements,
          description: vaga.description,
          wage: vaga.wage,
          qtdCandidate: vaga.qtdCandidate,
          activate: vaga.activate,
          category: vaga.category,
          candidatures: vaga.candidatures,
          company: vaga.company,
        })),
        totalCount: data.totalElements,
      };
    }

    return new Error("Erro ao listar os registros.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao listar os registros."
    );
  }
};

const create = async (
  dados: Omit<IDetalheVaga, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheVaga>("/vacancies", dados);

    if (data) {
      return data.id;
    }

    return new Error("Erro ao criar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao criar o registro."
    );
  }
};

const getById = async (id: number): Promise<IListagemVaga | Error> => {
  try {
    const { data } = await Api.get(`/vacancies/${id}`);
    console.log(data);

    if (data) {
      // Retorna os dados da vaga no formato esperado
      return {
        id: data.id,
        goal: data.goal,
        requirements: data.requirements,
        description: data.description,
        wage: data.wage,
        qtdCandidate: data.qtdCandidate,
        activate: data.activate,
        category: data.category,
        candidatures: data.candidatures,
        company: data.company,
      };
    }

    return new Error("Erro ao consultar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao consultar o registro."
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/vacancies/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro."
    );
  }
};


export const VagasService = {
  getAll,
  create,
  getById,
  //updateById,
  deleteById,
};
