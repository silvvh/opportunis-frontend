import { Api } from "../axios-config";
import { Environment } from "../../../environment";

export interface IListagemEmpresa {
  id: number;
  name: string;
  email: string;
  telephone: string;
  password: string;
  cnpj: string;
}

export interface IDetalheEmpresa2 {
  id: number;
  name: string;
  email: string;
  telephone: string;
  password: string;
  cnpj: string;
  nacionality?: string | null;
  qtd_employee?: number | null;
  site?: string | null;
  social_name?: string | null;
  category_id?: number | null;
}

export interface IDetalheEmpresa {
  id: number;
  name: string;
  email: string;
  telephone: string;
  password: string;
  role: string;
  socialName?: string;
  cnpj: string;
  qtdEmployee?: number;
  site?: string;
  companySector: string;
  nationality?: string;
  feedbacks?: any[]; // Ajuste o tipo dos feedbacks se necessário
  enabled?: boolean;
  authorities?: Array<{
    authority?:string;
  }>;
  username?: string;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
}



type TEmpresasComTotalCount = {
  data: IListagemEmpresa[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TEmpresasComTotalCount | Error> => {
  try {
    const urlRelativa = `/companies?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(
          headers["x-total-count"] || Environment.LIMITE_DE_LINHAS
        ),
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

const getById = async (id: number): Promise<IDetalheEmpresa2 | Error> => {
  try {
    const { data } = await Api.get(`/companies/${id}`);

    if (data) {
      return data;
    }

    return new Error("Erro ao consultar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao consultar o registro."
    );
  }
};

const create = async (
  dados: Omit<IDetalheEmpresa, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheEmpresa>("/companies", dados);

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

const updateById = async (
  id: number,
  dados: IDetalheEmpresa2
): Promise<void | Error> => {
  try {
    await Api.put(`/companies/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/companies/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro."
    );
  }
};

export const EmpresasService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
