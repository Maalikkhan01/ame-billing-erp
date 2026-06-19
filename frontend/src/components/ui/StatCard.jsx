import "./StatCard.css";

function StatCard({ title, value }) {
  const isDueCard = title === "Outstanding Due";

  return (
    <div className={`stat-card ${isDueCard ? "due-card" : ""}`}>
      <div className="stat-title">{title}</div>

      <div className="stat-value">{value}</div>
    </div>
  );
}

export default StatCard;
