
import React from "react";
import "./common.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const buttonClasses = [
    "sk-button",
    `sk-button--${variant}`,
    `sk-button--${size}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="sk-button__spinner" aria-hidden="true" />
      )}

      {children}
    </button>
  );
}

export default Button;
