import React from "react";
import s from "../../styles/authentication.module.scss";
import Switch from "../Switch/Switch";
import ToolTip from "../Helpers/ToolTip";
import useTheme from "../../hooks/useTheme";

export default function BackdropLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, handleThemeClick } = useTheme();
  return (
    <div className={s.backdrop}>
      {children}
      <div className={s.switch}>
        <ToolTip title={theme === "dark" ? "Light mode" : "Dark mode"}>
          <Switch handleThemeClick={handleThemeClick} />
        </ToolTip>
      </div>
    </div>
  );
}