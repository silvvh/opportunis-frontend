import { Api } from "../axios-config";
import { Environment } from "../../../environment";

import {
    IListagemEmpresa,
} from "../empresas/EmpresasService";
import { IListagemCategory } from "../category/CategoryService";


export interface IEmpresa {
    id: number;
  }

  export interface ICategory {
    id: number;
  }
export interface IListagemVaga {
    id: number;
    goal: string;
    requirements: string;
    description: string;
    wage: number;
    qtdCandidate: number;
    activate: boolean;
    category: IListagemCategory;
    company: IListagemEmpresa;
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
    company: IEmpresa;  // Alterado para um único objeto
}


type TVagasComTotalCount = {
    data: IListagemVaga[];
    totalCount: number;
};

const getAll = async (
    page = 1,
    filter = ""
): Promise<TVagasComTotalCount | Error> => {
    try {
        const urlRelativa = `/vacancies?page=${page - 1}&size=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

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

export const VagasService = {
    getAll,
    create,
    //getById,
    //updateById,
    //deleteById,
};
