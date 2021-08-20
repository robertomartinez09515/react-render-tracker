import React from "react";
import ChevronDown from "react-feather/dist/icons/chevron-down";

interface ButtonExpandProps {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
}

const ButtonExpand = ({ expanded, setExpanded }: ButtonExpandProps) => {
  const collapsedCls = expanded ? "expanded" : "";
  const disabledCls = typeof setExpanded === "function" ? "" : "disabled";
  const handleClick =
    typeof setExpanded === "function"
      ? (event: React.MouseEvent) => {
          event.stopPropagation();
          setExpanded(!expanded);
        }
      : null;

  return (
    <button
      className={`button-collapse ${collapsedCls} ${disabledCls}`}
      onClick={handleClick}
    >
      <ChevronDown />
    </button>
  );
};

export default ButtonExpand;
