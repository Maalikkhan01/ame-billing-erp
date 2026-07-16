import Modal from "../ui/Modal";

import "./RestoreProgress.css";

function RestoreProgress({ open, stage }) {
  if (!open) return null;

  const stages = [
    "Uploading Backup",
    "Validating Backup",
    "Checking Compatibility",
    "Restoring Database",
    "Finalizing",
  ];

  return (
    <Modal open={open} title="Restore Database" onClose={() => {}}>
      <div className="restore-progress">
        {stages.map((item, index) => {
          const active = index <= stage;

          return (
            <div
              key={item}
              className={`restore-stage ${active ? "active" : ""}`}
            >
              <div className="restore-stage-dot" />

              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default RestoreProgress;
