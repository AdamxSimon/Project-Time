// React

import { createContext, useEffect, useState } from "react";

// Types

import { Project } from "../types";

interface ProjectContextValue {
  projects: Project[];
  addProject: (project: Project) => void;
  removeProject: (id: number) => void;
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

  const addProject = (project: Project): void => {
    setProjects([...projects, project]);
  };

  const removeProject = (id: number): void => {
    setProjects(
      projects.filter((project) => {
        return project.id !== id;
      })
    );
  };

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const value: ProjectContextValue = { projects, addProject, removeProject };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export default ProjectProvider;
