import { useEffect, useState } from "react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

import "./CancelBillModal.css";

function CancelBillModal({ open, onClose, onSubmit, loading }) {
  const [reason, setReason] = useState("Customer Order Cancelled");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setReason("Customer Order Cancelled");
    setError("");
  }, [open]);

  const handleSubmit = async () => {
    setError("");

    if (!reason.trim()) {
      return setError("Cancel reason is required.");
    }

    try {
      await onSubmit({
        reason: reason.trim(),
      });

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to cancel bill",
      );
    }
  };

  return (
    <Modal open={open} title="Cancel Bill" onClose={onClose}>
      <div className="cancel-form">
        <p className="cancel-warning">
          This action will permanently mark the bill as
          <strong> CANCELLED</strong>.
        </p>

        <FormField
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {error && <div className="cancel-error">{error}</div>}

        <div className="cancel-actions">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>

          <Button variant="danger" loading={loading} onClick={handleSubmit}>
            Cancel Bill
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CancelBillModal;
