import "./Card.css";

function Card({ title, subtitle, actions, children, className = "" }) {
  return (
    <section className={`app-card ${className}`}>
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div>
            {title && <h2 className="card-title">{title}</h2>}

            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>

          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}

      {children}
    </section>
  );
}

export default Card;
