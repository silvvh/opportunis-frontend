import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Typography,
  LinearProgress,
  Paper,
  Select,
  MenuItem,
  Box,
  Button,
  Alert,
} from "@mui/material";
import Cookies from "js-cookie";
import { CurriculumService } from "../../shared/services/api/candidatos/CurriculumService";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

interface IFormData {
  id?: number | null | undefined;
  candidate?: { id: number | undefined };
  professionalGoal: string;
  additionalInfo: string;
  professionalExperiences: { organization: string; description: string }[];
  academicBackgroundExperience: { organization: string; description: string }[];
  coursesExperiences: { organization: string; description: string }[];
  languages: { language: string; level: number }[];
  skills: { name: string }[];
}

const Curriculum: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    id: -1,
    candidate: { id: Number(Cookies.get("id")) },
    professionalGoal: "",
    additionalInfo: "",
    professionalExperiences: [],
    academicBackgroundExperience: [],
    coursesExperiences: [],
    languages: [],
    skills: [],
  });

  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [curriculumId, setCurriculumId] = useState<Number | null | undefined>(
    -1
  );

  // Handlers
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    CurriculumService.save(formData, Number(Cookies.get("id")));
  };

  const handleAddItem = <K extends keyof IFormData>(
    field: K,
    newItem: IFormData[K] extends Array<infer U> ? U : never
  ) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as Array<any>), newItem],
      });
    }
  };

  const [error, setError] = useState<boolean>(false);

  const handleExperienceChange = <K extends keyof IFormData>(
    field: K,
    index: number,
    key: string,
    value: string
  ) => {
    if (Array.isArray(formData[field])) {
      const updatedItems = [...(formData[field] as Array<any>)];
      updatedItems[index] = { ...updatedItems[index], [key]: value };
      setFormData({ ...formData, [field]: updatedItems });
    } else {
      console.error(`O campo ${field} não é um array.`);
    }
  };

  const id = Cookies.get("id");
  const token = Cookies.get("token");

  useEffect(() => {
    CurriculumService.getByCandidateId(Number(id)).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        setError(true);
        const timer = setTimeout(() => setError(false), 3000);
        return () => clearTimeout(timer);
      } else {
        if (result != null) {
          formRef.current?.setData(result);
          setFormData(result);
          setCurriculumId(result.id);
        }
      }
    });
  }, [id, error]);

  return (
    <Paper
      sx={{ margin: 1, display: "flex", flexDirection: "column", padding: 2 }}
      variant="outlined"
    >
      {isLoading && <LinearProgress variant="indeterminate" />}

      <Typography variant="h6" gutterBottom>
        Currículo
      </Typography>

      <Form
        ref={formRef}
        onSubmit={handleSave}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <TextField
          fullWidth
          label="Objetivo Profissional"
          name="professionalGoal"
          value={formData.professionalGoal}
          onChange={(e) => handleChange("professionalGoal", e.target.value)}
          disabled={isLoading}
          margin="normal"
        />

        {/* Informações Adicionais */}
        <TextField
          fullWidth
          label="Informações Adicionais"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={(e) => handleChange("additionalInfo", e.target.value)}
          disabled={isLoading}
          margin="normal"
        />

        {/* Experiências Profissionais */}
        <Typography variant="h6" gutterBottom>
          Experiências Profissionais
        </Typography>
        {formData.professionalExperiences.map((experience, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Organização"
              value={experience.organization}
              onChange={(e) =>
                handleExperienceChange(
                  "professionalExperiences",
                  index,
                  "organization",
                  e.target.value
                )
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Descrição"
              value={experience.description}
              onChange={(e) =>
                handleExperienceChange(
                  "professionalExperiences",
                  index,
                  "description",
                  e.target.value
                )
              }
              margin="normal"
            />
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() =>
            handleAddItem("professionalExperiences", {
              organization: "",
              description: "",
            })
          }
        >
          Adicionar Experiência
        </Button>

        {/* Formação Acadêmica */}
        <Typography variant="h6" gutterBottom>
          Formação Acadêmica
        </Typography>
        {formData.academicBackgroundExperience.map((experience, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Organização"
              value={experience.organization}
              onChange={(e) =>
                handleExperienceChange(
                  "academicBackgroundExperience",
                  index,
                  "organization",
                  e.target.value
                )
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Descrição"
              value={experience.description}
              onChange={(e) =>
                handleExperienceChange(
                  "academicBackgroundExperience",
                  index,
                  "description",
                  e.target.value
                )
              }
              margin="normal"
            />
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() =>
            handleAddItem("academicBackgroundExperience", {
              organization: "",
              description: "",
            })
          }
        >
          Adicionar Formação Acadêmica
        </Button>

        {/* Cursos */}
        <Typography variant="h6" gutterBottom>
          Cursos
        </Typography>
        {formData.coursesExperiences.map((course, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Organização"
              value={course.organization}
              onChange={(e) =>
                handleExperienceChange(
                  "coursesExperiences",
                  index,
                  "organization",
                  e.target.value
                )
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Descrição"
              value={course.description}
              onChange={(e) =>
                handleExperienceChange(
                  "coursesExperiences",
                  index,
                  "description",
                  e.target.value
                )
              }
              margin="normal"
            />
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() =>
            handleAddItem("coursesExperiences", {
              organization: "",
              description: "",
            })
          }
        >
          Adicionar Curso
        </Button>

        {/* Habilidades */}
        <Typography variant="h6" gutterBottom>
          Habilidades
        </Typography>
        {formData.skills.map((skill, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Habilidade"
              value={skill.name}
              onChange={(e) =>
                handleExperienceChange("skills", index, "name", e.target.value)
              }
              margin="normal"
            />
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() => handleAddItem("skills", { name: "" })}
        >
          Adicionar Habilidade
        </Button>

        {/* Idiomas */}
        <Typography variant="h6" gutterBottom>
          Idiomas
        </Typography>
        {formData.languages.map((lang, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Idioma"
              value={lang.language}
              onChange={(e) => {
                const updatedLanguages = [...formData.languages];
                updatedLanguages[index] = {
                  ...updatedLanguages[index],
                  language: e.target.value,
                };
                setFormData({ ...formData, languages: updatedLanguages });
              }}
              margin="normal"
            />
            <Select
              fullWidth
              value={lang.level ?? 0}
              onChange={(e) => {
                const updatedLanguages = [...formData.languages];
                updatedLanguages[index] = {
                  ...updatedLanguages[index],
                  level: e.target.value as number,
                };
                setFormData({ ...formData, languages: updatedLanguages });
              }}
              margin="dense"
            >
              <MenuItem value={0}>Nenhum</MenuItem>
              <MenuItem value={1}>Básico</MenuItem>
              <MenuItem value={2}>Intermediário</MenuItem>
              <MenuItem value={3}>Avançado</MenuItem>
              <MenuItem value={4}>Fluente</MenuItem>
            </Select>
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() => handleAddItem("languages", { language: "", level: 0 })}
        >
          Adicionar Idioma
        </Button>

        {/* Botão de Salvar */}
        <Button
          variant="contained"
          type="submit"
          color="primary"
          className="full-width"
          disabled={isLoading}
          sx={{ width: "100%", marginTop: 4 }}
        >
          Salvar Currículo
        </Button>
      </Form>
      {error && <Alert severity="error">Falha ao salvar currículo</Alert>}
    </Paper>
  );
};

export default Curriculum;
