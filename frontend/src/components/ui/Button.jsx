import "./Button.css";

function Button({
  children,
  as: Component = "button",
  variant = "primary",
  size = "",
  type = "button",
  className = "",
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <Component
      className={`app-btn ${variant} ${size} ${className}`}
      {...(Component === "button"
        ? {
            type,
            disabled: disabled || loading,
          }
        : {})}
      {...props}
    >
      {loading ? "Loading..." : children}
    </Component>
  );
}

export default Button;
