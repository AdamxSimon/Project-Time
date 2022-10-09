// React

import { createContext, useEffect, useState, useContext } from "react";

// Types

import { Project } from "../types";
import { CurrencyContext } from "./CurrencyContext";

export enum ProjectStatus {
  Active,
  Completed,
  Abandoned,
}

interface ProjectContextValue {
  projects: Project[];
  maxProjects: number;
  projectSlotUpgradeCost: number;
  upgradeProjectSlots: () => void;
  addProject: (project: Project) => void;
  abandonProject: (id: number) => void;
  completeProject: (id: number) => void;
  isAddingProject: boolean;
  setIsAddingProject: React.Dispatch<React.SetStateAction<boolean>>;
  updateProjectSeconds: (projectToUpdate: Project, seconds: number) => void;
}

const initialProjectsSaveData: string | null = localStorage.getItem("projects");
const initialMaxProjectsSaveData: string | null =
  localStorage.getItem("maxProjects");

export const ProjectContext: React.Context<ProjectContextValue> =
  createContext<ProjectContextValue>({} as ProjectContextValue);

interface ProjectProviderProps {
  children: JSX.Element;
}

const ProjectProvider = ({ children }: ProjectProviderProps): JSX.Element => {
  const { addCurrency, removeCurrency } = useContext(CurrencyContext);

  const [projects, setProjects] = useState<Project[]>(
    initialProjectsSaveData ? JSON.parse(initialProjectsSaveData) : []
  );
  const [maxProjects, setMaxProjects] = useState<number>(
    initialMaxProjectsSaveData ? JSON.parse(initialMaxProjectsSaveData) : 1
  );
  const [isAddingProject, setIsAddingProject] = useState<boolean>(
    !initialProjectsSaveData
  );

  const projectSlotUpgradeCost: number = (maxProjects + 1) * 10;

  const addProject = (project: Project): void => {
    setProjects([...projects, project]);
    setIsAddingProject(false);
    addCurrency(10);
  };

  const abandonProject = (id: number): void => {
    setProjects((projects) =>
      projects.map<Project>((project) => {
        if (project.id === id) {
          project.status = ProjectStatus.Abandoned;
        }
        return project;
      })
    );
  };

  const completeProject = (id: number): void => {
    setProjects((projects) =>
      projects.map<Project>((project) => {
        if (project.id === id) {
          project.status = ProjectStatus.Completed;
        }
        return project;
      })
    );
  };

  const updateProjectSeconds = (
    projectToUpdate: Project,
    seconds: number
  ): void => {
    setProjects((projects) =>
      projects.map((project) => {
        if (project.id === projectToUpdate.id) {
          return {
            ...project,
            totalSecondsSpent: seconds,
          };
        }
        return project;
      })
    );
  };

  const upgradeProjectSlots = (): void => {
    setMaxProjects((previousState) => (previousState += 1));
    removeCurrency(projectSlotUpgradeCost);
  };

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));

    const activeProjects: Project[] = projects.filter((project) => {
      return project.status === ProjectStatus.Active;
    });

    if (!activeProjects.length) {
      setIsAddingProject(true);
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("maxProjects", maxProjects.toString());
  }, [maxProjects]);

  const value: ProjectContextValue = {
    projects,
    maxProjects,
    projectSlotUpgradeCost,
    upgradeProjectSlots,
    addProject,
    abandonProject,
    completeProject,
    isAddingProject,
    setIsAddingProject,
    updateProjectSeconds,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export default ProjectProvider;
