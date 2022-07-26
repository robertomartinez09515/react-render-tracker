import * as React from "react";

interface ButtonToggleProps {
  icon: JSX.Element;
  isActive: boolean;
  onChange: (fn: (state: boolean) => boolean) => void;
  tooltip: string;
}

const ButtonToggle = ({
  icon,
  isActive,
  onChange,
  tooltip,
}: ButtonToggleProps) => {
  const handleClick = () => {
    onChange((prev: boolean) => !prev);
  };

  return (
    <button
      className={`button-toggle ${isActive ? "active" : ""}`}
      onClick={handleClick}
      title={tooltip}
    >
      {icon}
    </button>
  );
};

export default ButtonToggle;
