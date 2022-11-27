// React

import { useCallback, useContext, useMemo, useRef } from "react";

// Context

import { CurrencyContext } from "../context/CurrencyContext";
import { ProjectContext } from "../context/ProjectContext";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import { ThemesContext } from "../context/ThemesContext";
import { TimerContext } from "../context/TimerContext";

// Assets

import CoinPNG from "../assets/currency/coin.png";
import ProjectPNG from "../assets/projects/projects-sheet.png";
import TimerPNG from "../assets/timer/timer.png";

// Types

import InfoContainer, {
  InfoContainerProps,
} from "./info-container/InfoContainer";

// Styles

import classes from "./styles.module.css";

const Toolbar = (): JSX.Element => {
  const { currency } = useContext(CurrencyContext);
  const { activeProjects, projectsDataRef, uploadProjectData, maxProjects } =
    useContext(ProjectContext);
  const { isSmallScreen } = useContext(ScreenSizeContext);
  const { fonts } = useContext(ThemesContext);
  const { timerAsDuration } = useContext(TimerContext);

  const uploadProjectsRef = useRef<HTMLInputElement | null>(null);

  const infoContainers: InfoContainerProps[] = useMemo(() => {
    return [
      {
        icon: ProjectPNG,
        altText: "Projects",
        info: `${activeProjects.length} / ${maxProjects}`,
      },
      {
        icon: CoinPNG,
        altText: "Currency",
        info: currency.toString(),
      },
      {
        icon: TimerPNG,
        altText: "Timer",
        info: timerAsDuration,
      },
    ];
  }, [activeProjects, currency, maxProjects, timerAsDuration]);

  const handleUpload = useCallback((): void => {
    if (uploadProjectsRef.current) {
      uploadProjectsRef.current.click();
    }
  }, []);

  return (
    <div
      className={classes.toolbar}
      style={{ justifyContent: isSmallScreen ? "center" : "space-between" }}
    >
      <div className={classes.infoContainers}>
        {infoContainers.map((infoContainer) => {
          return (
            <InfoContainer
              key={infoContainer.altText}
              icon={infoContainer.icon}
              altText={infoContainer.altText}
              info={infoContainer.info}
            />
          );
        })}
      </div>

      {!isSmallScreen && (
        <div className={classes.settingsContainer}>
          <a
            className={classes.settingsButton}
            style={fonts.standard}
            href={projectsDataRef}
            download={"projects.json"}
          >
            {"Save"}
          </a>

          <div
            className={classes.settingsButton}
            style={fonts.standard}
            onClick={handleUpload}
          >
            {"Upload"}
          </div>

          <input
            ref={uploadProjectsRef}
            style={{ display: "none" }}
            type={"file"}
            accept={".json"}
            onChange={async () => {
              if (uploadProjectsRef?.current?.files) {
                const file: File = uploadProjectsRef.current.files[0];
                const fileText: string = await file.text();
                const projectData = JSON.parse(fileText);
                uploadProjectData(projectData);
                uploadProjectsRef.current.value = "";
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toolbar;
