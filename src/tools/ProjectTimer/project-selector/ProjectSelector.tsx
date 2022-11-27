// React

import { useContext, useEffect, useMemo, useState } from "react";

// Context

import { ProjectContext, ProjectStatus } from "../../../context/ProjectContext";
import { ThemesContext } from "../../../context/ThemesContext";

// Assets

import DropdownArrowPNG from "../../../assets/general/dropdown-arrow.png";

// Types

import { Project } from "../../../types";

// Styles

import classes from "./styles.module.css";

interface ProjectSelectorProps {
  selectProject: (project: Project) => void;
}

const ProjectSelector = (props: ProjectSelectorProps): JSX.Element => {
  const { selectProject } = props;

  const { projects, activeProjects } = useContext(ProjectContext);
  const { fonts } = useContext(ThemesContext);

  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    projects.find((project) => {
      return project.status === ProjectStatus.Active;
    })
  );

  const [shouldShowList, setShouldShowList] = useState<boolean>(false);

  const filteredList: Project[] = useMemo(() => {
    return activeProjects.filter((project) => {
      return project.id !== selectedProject?.id;
    });
  }, [activeProjects, selectedProject]);

  useEffect((): void => {
    if (selectedProject) {
      selectProject(selectedProject);
    }
  }, [selectProject, selectedProject]);

  return (
    <div
      className={classes.projectSelector}
      style={{
        borderBottomLeftRadius: shouldShowList ? 0 : 8,
        borderBottomRightRadius: shouldShowList ? 0 : 8,
      }}
      onClick={() => setShouldShowList(!shouldShowList)}
    >
      <div className={classes.projectName} style={fonts.standard}>
        {selectedProject?.name ?? ""}
      </div>
      <img
        src={DropdownArrowPNG}
        alt={shouldShowList ? "Collapse" : "Expand"}
        height={fonts.standard.fontSize}
        className={classes.arrow}
        style={{
          transform: shouldShowList ? "rotate(180deg)" : "rotate(0deg)",
        }}
      />

      {shouldShowList && (
        <div className={classes.projectList}>
          {filteredList.map((project) => {
            return (
              <div
                key={project.id}
                className={classes.projectItem}
                style={fonts.standard}
                onClick={() => {
                  setSelectedProject(
                    activeProjects.find((activeProject) => {
                      return project.id === activeProject.id;
                    })
                  );
                }}
              >
                {project.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
