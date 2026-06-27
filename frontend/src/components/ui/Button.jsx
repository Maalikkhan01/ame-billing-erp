import "./Button.css";

function Button({
  children,
  as: Component = "button",
  variant = "primary",
  size = "",
  type = "button",
  className = "",
  ...props
}) {
  return (
    <Component
      className={`app-btn ${variant} ${size} ${className}`}
      {...(Component === "button" ? { type } : {})}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
