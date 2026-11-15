
import React from "react";
import "./common.css";

function Card({
  children,
  title,
  description,
  footer,
  hoverable = false,
  className = "",
  ...props
}) {
  const cardClasses = [
    "sk-card",
    hoverable ? "sk-card--hoverable" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={cardClasses} {...props}>
      {(title || description) && (
        <div className="sk-card__header">
          {title && (
            <h3 className="sk-card__title">{title}</h3>
          )}

          {description && (
            <p className="sk-card__description">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="sk-card__body">
        {children}
      </div>

      {footer && (
        <div className="sk-card__footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
