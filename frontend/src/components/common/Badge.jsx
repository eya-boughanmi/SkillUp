
import React from "react";
import "./common.css";

function Badge({
  children,
  variant = "neutral",
  className = ""
}) {
  const badgeClasses = [
    "sk-badge",
    `sk-badge--${variant}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
}

export default Badge;
