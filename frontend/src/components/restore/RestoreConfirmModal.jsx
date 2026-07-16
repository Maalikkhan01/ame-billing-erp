import { useEffect, useState } from "react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

import "./RestoreConfirmModal.css";

const CONFIRM_TEXT = "RESTORE DATABASE";

function RestoreConfirmModal({
  open,
  loading,
  backupInfo,
  onClose,
  onConfirm,
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setText("");
    setError("");
  }, [open]);

  const handleConfirm = async () => {
    setError("");

    if (text.trim() !== CONFIRM_TEXT) {
      setError(`Please type "${CONFIRM_TEXT}" exactly.`);
      return;
    }

    await onConfirm();

    setText("");

    onClose();
  };

  return (
    <Modal open={open} title="Restore Database" onClose={onClose}>
      <div className="restore-warning">
        <h3>⚠ Warning</h3>

        <p>Restoring this backup will replace the current database.</p>

        <p>This action cannot be undone.</p>
      </div>

      {backupInfo && (
        <div className="restore-info">
          <div>
            <strong>Version</strong>

            <span>{backupInfo.manifest.version}</span>
          </div>

          <div>
            <strong>Backup Date</strong>

            <span>
              {new Date(backupInfo.manifest.backupDate).toLocaleString()}
            </span>
          </div>

          <div>
            <strong>Total Customers</strong>

            <span>{backupInfo.summary.customers}</span>
          </div>

          <div>
            <strong>Total Products</strong>

            <span>{backupInfo.summary.products}</span>
          </div>

          <div>
            <strong>Total Bills</strong>

            <span>{backupInfo.summary.bills}</span>
          </div>

          <div>
            <strong>Total Ledger Entries</strong>

            <span>{backupInfo.summary.ledger}</span>
          </div>
        </div>
      )}

      <p className="restore-instruction">
        Type
        <strong> {CONFIRM_TEXT} </strong>
        to continue.
      </p>

      <FormField
        placeholder={CONFIRM_TEXT}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {error && <div className="restore-error">{error}</div>}

      <div className="restore-actions">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="danger" onClick={handleConfirm} disabled={loading}>
          {loading ? "Restoring..." : "Restore Database"}
        </Button>
      </div>
    </Modal>
  );
}

export default RestoreConfirmModal;
