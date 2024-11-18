import { Api } from "../axios-config";

export interface IListagemCandidato {
  id: number;
  name: string;
  email: string;
  telephone: string;
  password: string;
  cpf: string;
  genre: string;
  role: string;
}

export interface IDetalheCandidato {
  id: number;
  name: string;
  email: string;
  telephone: string;
  password: string;
  cpf: string;
  genre: string;
  role: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IListagemEmpresa {
  id: number;
  name: string;
  email: string;
  telephone: string;
  password: string;
  cnpj: string;
  category: string;
  role: string;
}

export interface IDetalheEmpresa {
  id: number;
  name: string;
  email: string;
  telephone: string;
  password: string;
  cnpj: string;
  category: string;
  role: string;
}

export interface IToken {
  token: string;
  role: string;
}

const candidateRegister = async (
  dados: Omit<IDetalheCandidato, "id">
): Promise<any | Error> => {
  try {
    const data = await Api.post<IDetalheCandidato>(
      "/auth/candidate-register",
      dados
    );

    if (data.status === 200) {
      return;
    }

    return new Error("Erro ao cadastrar usuário.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao cadastrar usuário."
    );
  }
};

const companyRegister = async (
  dados: Omit<IDetalheEmpresa, "id">
): Promise<any | Error> => {
  try {
    const data = await Api.post<IDetalheCandidato>(
      "/auth/company-register",
      dados
    );

    if (data.status === 200) {
      return;
    }

    return new Error("Erro ao cadastrar usuário.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao cadastrar usuário."
    );
  }
};

const login = async (dados: ILogin): Promise<any | Error> => {
  try {
    const { data } = await Api.post<IToken>("/auth/login", dados);

    if (data != null) {
      return data;
    }

    return new Error("Usuário não encontrado");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Usuário não encontrado"
    );
  }
};

export const AuthService = {
  candidateRegister,
  companyRegister,
  login,
};
