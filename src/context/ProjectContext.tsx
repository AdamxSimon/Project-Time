// React

import { createContext, useEffect, useState } from "react";

// Types

import { Project } from "../types";

interface ProjectContextValue {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const initialSaveData: string | null = localStorage.getItem("projects");

const ProjectContext: React.Context<ProjectContextValue> =
  createContext<ProjectContextValue>({} as ProjectContextValue);

interface ProjectProviderProps {
  children: JSX.Element;
}

const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [projects, setProjects] = useState<Project[]>(
    initialSaveData ? JSON.parse(initialSaveData) : []
  );

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const value = { projects, setProjects };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export default ProjectProvider;
