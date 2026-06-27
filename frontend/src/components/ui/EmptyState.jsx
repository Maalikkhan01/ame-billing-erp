import "./EmptyState.css";

function EmptyState({ text = "No Data Found" }) {
  return <div className="empty-state-component">{text}</div>;
}

export default EmptyState;
