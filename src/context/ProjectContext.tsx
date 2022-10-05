// React

import { createContext, useEffect, useState } from "react";

// Types

import { Project } from "../types";

export enum ProjectStatus {
  Active,
  Completed,
  Abandoned,
}

interface ProjectContextValue {
  projects: Project[];
  addProject: (project: Project) => void;
  abandonProject: (id: number) => void;
  completeProject: (id: number) => void;
  isAddingProject: boolean;
  setIsAddingProject: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialSaveData: string | null = localStorage.getItem("projects");

export const ProjectContext: React.Context<ProjectContextValue> =
  createContext<ProjectContextValue>({} as ProjectContextValue);

interface ProjectProviderProps {
  children: JSX.Element;
}

const ProjectProvider = ({ children }: ProjectProviderProps): JSX.Element => {
  const [projects, setProjects] = useState<Project[]>(
    initialSaveData ? JSON.parse(initialSaveData) : []
  );
  const [isAddingProject, setIsAddingProject] = useState<boolean>(
    !initialSaveData
  );

  const addProject = (project: Project): void => {
    setProjects([...projects, project]);
    setIsAddingProject(false);
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

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));

    const activeProjects: Project[] = projects.filter((project) => {
      return project.status === ProjectStatus.Active;
    });

    if (!activeProjects.length) {
      setIsAddingProject(true);
    }
  }, [projects]);

  const value: ProjectContextValue = {
    projects,
    addProject,
    abandonProject,
    completeProject,
    isAddingProject,
    setIsAddingProject,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export default ProjectProvider;
