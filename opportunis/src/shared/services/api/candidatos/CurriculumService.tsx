import { Api } from "../axios-config";

export interface ICurriculo {
  id?: number | null;
  candidate?: { id: number | undefined };
  professionalGoal: string;
  additionalInfo: string;
  professionalExperiences: { organization: string; description: string }[];
  academicBackgroundExperience: { organization: string; description: string }[];
  coursesExperiences: { organization: string; description: string }[];
  languages: { language: string; level: number }[];
  skills: { name: string }[];
}

const save = async (dados: ICurriculo): Promise<void | Error> => {
  try {
    delete dados.id;
    await Api.post(`/candidates/curriculumns`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

const getByCandidateId = async (id: number): Promise<ICurriculo | Error> => {
  try {
    const { data } = await Api.get(`/candidates/${id}/curriculumns`);

    if (data) {
      const firstCurriculum = data[0];
      return firstCurriculum;
    }

    return new Error("Erro ao consultar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao consultar o registro."
    );
  }
};

const update = async (
  id: number,
  dados: ICurriculo,
  token: string | undefined
): Promise<ICurriculo | Error> => {
  try {
    let dadosUpdate = dados;
    delete dadosUpdate.candidate;
    await Api.put(`/candidates/curriculumns/${id}`, dados);

    return new Error("Erro ao consultar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

export const CurriculumService = {
  save,
  getByCandidateId,
  update,
};
