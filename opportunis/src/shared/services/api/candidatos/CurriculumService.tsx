import { Api } from "../axios-config";
import { Environment } from "../../../environment";

export interface ICurriculo {
  id: number;
  name: string;
  email: string;
  telephone: string;
  password: string;
  cpf: string;
  genre: string;
  role: number[];
}

export const CurriculumService = {};
