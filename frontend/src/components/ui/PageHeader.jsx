import "./PageHeader.css";

function PageHeader({
  title,

  subtitle,

  right,
}) {
  return (
    <div className="page-header-system">
      <div>
        <h1>{title}</h1>

        {subtitle && <p>{subtitle}</p>}
      </div>

      {right}
    </div>
  );
}

export default PageHeader;
