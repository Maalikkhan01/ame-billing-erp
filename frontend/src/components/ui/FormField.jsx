import { forwardRef } from "react";

import "./FormField.css";

const FormField = forwardRef(
  ({ as: Component = "input", className = "", ...props }, ref) => {
    const variantClass =
      Component === "textarea"
        ? "textarea"
        : Component === "select"
          ? "select"
          : "";

    return (
      <Component
        ref={ref}
        className={`app-field ${variantClass} ${className}`}
        {...props}
      />
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
