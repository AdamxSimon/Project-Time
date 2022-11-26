// React

import {
  createContext,
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";

// Context

import { CurrencyContext } from "./CurrencyContext";

// Types

import { Project } from "../types";

const ADDED_PROJECT_VALUE = 10;
const ABANDONED_PROJECT_COST = 10;

export enum ProjectStatus {
  Active,
  Completed,
  Abandoned,
}

interface ProjectContextValue {
  projects: Project[];
  activeProjects: Project[];
  projectsDataRef: string;
  uploadProjectData: (projectData: Project[]) => void;
  maxProjects: number;
  projectSlotUpgradeCost: number;
  upgradeProjectSlots: () => void;
  isAddingProject: boolean;
  setIsAddingProject: React.Dispatch<React.SetStateAction<boolean>>;
  addProject: (project: Project) => void;
  abandonProject: (id: number) => void;
  completeProject: (id: number) => void;
  updateProjectName: (project: Project, name: string) => void;
  updateProjectSeconds: (project: Project, totalSecondsSpent: number) => void;
}

const initialProjectsSaveData: string | null = localStorage.getItem("projects");
const initialMaxProjectsSaveData: string | null =
  localStorage.getItem("maxProjects");

export const ProjectContext: React.Context<ProjectContextValue> =
  createContext<ProjectContextValue>({
    projects: [],
    activeProjects: [],
    projectsDataRef: "",
    uploadProjectData: () => {},
    maxProjects: 1,
    projectSlotUpgradeCost: 20,
    upgradeProjectSlots: () => {},
    isAddingProject: true,
    setIsAddingProject: () => {},
    addProject: () => {},
    abandonProject: () => {},
    completeProject: () => {},
    updateProjectName: () => {},
    updateProjectSeconds: () => {},
  });

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

  const activeProjects: Project[] = useMemo(() => {
    return projects.filter(
      (project) => project.status === ProjectStatus.Active
    );
  }, [projects]);

  const projectsDataRef: string = useMemo(() => {
    return (
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(projects))
    );
  }, [projects]);

  const projectSlotUpgradeCost: number = useMemo(() => {
    return (maxProjects + 1) * 10;
  }, [maxProjects]);

  const uploadProjectData = useCallback(
    (projectData: Project[]): void => {
      const uuids: number[] = projects.map((project) => project.id);
      const filteredData: Project[] =
        uuids.length > 0
          ? projectData.filter((project) => !uuids.includes(project.id))
          : projectData;
      const newProjectsState: Project[] = [...projects, ...filteredData];
      setProjects(newProjectsState);
      const newActiveProjects: number = newProjectsState.filter(
        (project) => project.status === ProjectStatus.Active
      ).length;
      if (newActiveProjects > maxProjects) setMaxProjects(newActiveProjects);
      setIsAddingProject(!newActiveProjects);
    },
    [projects, maxProjects]
  );

  const addProject = useCallback(
    (project: Project): void => {
      setProjects((projects) => [...projects, project]);
      setIsAddingProject(false);
      addCurrency(ADDED_PROJECT_VALUE);
    },
    [addCurrency]
  );

  const abandonProject = useCallback(
    (id: number): void => {
      setProjects((projects) =>
        projects.map<Project>((project) => {
          if (project.id === id) {
            project.status = ProjectStatus.Abandoned;
          }
          return project;
        })
      );
      removeCurrency(ABANDONED_PROJECT_COST);
    },
    [removeCurrency]
  );

  const completeProject = useCallback((id: number): void => {
    setProjects((projects) =>
      projects.map<Project>((project) => {
        if (project.id === id) {
          project.status = ProjectStatus.Completed;
        }
        return project;
      })
    );
  }, []);

  const updateProjectName = useCallback(
    (projectToUpdate: Project, name: string): void => {
      setProjects((projects) =>
        projects.map((project) => {
          if (project.id === projectToUpdate.id) {
            return {
              ...project,
              name,
            };
          }
          return project;
        })
      );
    },
    []
  );

  const updateProjectSeconds = useCallback(
    (projectToUpdate: Project, totalSecondsSpent: number): void => {
      setProjects((projects) =>
        projects.map((project) => {
          if (project.id === projectToUpdate.id) {
            return {
              ...project,
              totalSecondsSpent,
            };
          }
          return project;
        })
      );
    },
    []
  );

  const upgradeProjectSlots = useCallback((): void => {
    setMaxProjects((maxProjects) => (maxProjects += 1));
    removeCurrency(projectSlotUpgradeCost);
  }, [projectSlotUpgradeCost, removeCurrency]);

  useEffect((): void => {
    localStorage.setItem("projects", JSON.stringify(projects));
    if (!isAddingProject) setIsAddingProject(!activeProjects.length);
  }, [projects, activeProjects, isAddingProject]);

  useEffect((): void => {
    localStorage.setItem("maxProjects", maxProjects.toString());
  }, [maxProjects]);

  const value: ProjectContextValue = useMemo(() => {
    return {
      projects,
      activeProjects,
      projectsDataRef,
      uploadProjectData,
      maxProjects,
      projectSlotUpgradeCost,
      upgradeProjectSlots,
      isAddingProject,
      setIsAddingProject,
      addProject,
      abandonProject,
      completeProject,
      updateProjectName,
      updateProjectSeconds,
    };
  }, [
    projects,
    activeProjects,
    projectsDataRef,
    uploadProjectData,
    maxProjects,
    projectSlotUpgradeCost,
    upgradeProjectSlots,
    isAddingProject,
    setIsAddingProject,
    addProject,
    abandonProject,
    completeProject,
    updateProjectName,
    updateProjectSeconds,
  ]);

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export default ProjectProvider;
