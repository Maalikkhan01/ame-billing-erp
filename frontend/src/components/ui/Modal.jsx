import "./Modal.css";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="app-modal-overlay" onClick={onClose}>
      <div className="app-modal" onClick={(e) => e.stopPropagation()}>
        <div className="app-modal-header">
          <h2>{title}</h2>

          <button className="app-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="app-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
