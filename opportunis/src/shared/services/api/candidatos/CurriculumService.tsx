import { Api } from "../axios-config";

export interface ICurriculo {
  candidate: { id: number | undefined };
  professionalGoal: string;
  additionalInfo: string;
  professionalExperiences: { organization: string; description: string }[];
  academicBackgroundExperience: { organization: string; description: string }[];
  courses: { organization: string; description: string }[];
  language: { language: string; level: number }[];
  skills: { name: string }[];
}

const save = async (dados: ICurriculo): Promise<void | Error> => {
  try {
    await Api.post(`/candidates/curriculumns`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

export const CurriculumService = {
  save,
};
