import { Api } from "../axios-config";
import { Environment } from "../../../environment";

import {
  IDetalheEmpresa,
    IListagemEmpresa,
} from "../empresas/EmpresasService";
import { IDetalheCategory, IListagemCategory } from "../category/CategoryService";

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

export interface ICreateVaga {
  id: number;
  goal: string;
  requirements: string;
  description: string;
  wage: number;
  qtdCandidate: number;
  activate: boolean;
  category: {
    id: number;
  }; // Alterado para um único objeto
  company: {
    id: number;
  };  // Alterado para um único objeto
}

export interface IDetalheVaga {
    id: number;
    goal: string;
    requirements: string;
    description: string;
    wage: number;
    qtdCandidate: number;
    activate: boolean;
    category: IDetalheCategory; // Alterado para um único objeto
    company: IDetalheEmpresa;  // Alterado para um único objeto
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
  dados: Omit<ICreateVaga, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<ICreateVaga>("/vacancies", dados);

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
    //getById,
    //updateById,
    deleteById,
};
