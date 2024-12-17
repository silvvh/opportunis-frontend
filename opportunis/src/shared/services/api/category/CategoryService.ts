import { Api } from "../axios-config";
import { Environment } from "../../../environment";

import { IListagemEmpresa } from "../empresas/EmpresasService";

export interface IListagemCategory {
  id: number;
  name: string;
}

export interface IDetalheCategory {
  id: number;
  name: string;
}

type TCategoriesComTotalCount = {
  data: IListagemCategory[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TCategoriesComTotalCount | Error> => {
  try {
    const urlRelativa = `/categories?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

    const { data } = await Api.get(urlRelativa);

    if (data && data.content) {
      // Acesse o campo 'content'
      return {
        data: data.content, // Extrai o array de categorias
        totalCount: data.totalElements || 0, // Use o totalElements para o count
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

export const CategoryService = {
  getAll,
};
