
import React from "react";
import "./common.css";

function Input({
  label,
  id,
  error,
  helperText,
  className = "",
  ...props
}) {
  const inputId = id || props.name;

  const describedBy = [
    error ? `${inputId}-error` : null,
    helperText && !error ? `${inputId}-helper` : null
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className="sk-input-group">
      {label && (
        <label htmlFor={inputId} className="sk-input__label">
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={[
          "sk-input",
          error ? "sk-input--error" : "",
          className
        ].filter(Boolean).join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />

      {error && (
        <span
          id={`${inputId}-error`}
          className="sk-input__error"
          role="alert"
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span
          id={`${inputId}-helper`}
          className="sk-input__helper"
        >
          {helperText}
        </span>
      )}
    </div>
  );
}

export default Input;
