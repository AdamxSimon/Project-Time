// React

import { useContext, useEffect, useMemo } from "react";

// Context

import { ProjectContext, ProjectStatus } from "../../context/ProjectContext";
import { CurrencyContext } from "../../context/CurrencyContext";
import { ToastContext } from "../../context/ToastContext";

// Components

import CurrencyButton from "../../components/currency-button/CurrencyButton";
import ProjectInputForm from "./project-input-form/ProjectInputForm";
import ProjectItem from "./project-item/ProjectItem";

// Styles

import classes from "./styles.module.css";

const ProjectTable = (): JSX.Element => {
  const { currency } = useContext(CurrencyContext);
  const {
    projects,
    activeProjects,
    projectSlotUpgradeCost,
    maxProjects,
    upgradeProjectSlots,
    isAddingProject,
    setIsAddingProject,
  } = useContext(ProjectContext);
  const { showToast } = useContext(ToastContext);

  const activeFilters: ProjectStatus[] = useMemo(
    () => [ProjectStatus.Active],
    []
  );

  const renderedProjects = useMemo(() => {
    return projects.filter((project) => {
      return activeFilters.includes(project.status);
    });
  }, [projects, activeFilters]);

  const areProjectSlotsFull: boolean = useMemo(() => {
    return activeProjects.length === maxProjects;
  }, [activeProjects, maxProjects]);

  useEffect(() => {
    return () => {
      setIsAddingProject(false);
    };
  }, []);

  if (isAddingProject) {
    return <ProjectInputForm />;
  } else {
    return (
      <>
        <div className={classes.projectTable}>
          {renderedProjects.map((project) => {
            return <ProjectItem key={project.id} project={project} />;
          })}
        </div>

        <CurrencyButton
          text={areProjectSlotsFull ? "Upgrade Project Slots" : "Add Project"}
          currencyAmount={areProjectSlotsFull ? projectSlotUpgradeCost : 10}
          onClick={() => {
            if (!areProjectSlotsFull) {
              setIsAddingProject(true);
            } else if (currency > projectSlotUpgradeCost) {
              upgradeProjectSlots();
            } else {
              showToast("Not Enough Coins!");
            }
          }}
          isCostly={areProjectSlotsFull}
          styleOverrides={{
            width: "max-content",
            position: "absolute",
            bottom: 8,
            left: "50%",
            right: "50%",
            transform: "translate(-50%)",
          }}
        />
      </>
    );
  }
};

export default ProjectTable;
