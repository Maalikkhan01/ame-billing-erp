import { useState } from "react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

import "./AdjustmentModal.css";

const REASONS = [
  "ROUND_OFF",
  "DISCOUNT",
  "WAIVE_OFF",
  "DAMAGE",
  "MANUAL_CORRECTION",
  "OTHER",
];

function AdjustmentModal({ open, onClose, onSubmit, customer, loading }) {
  const getInitialState = () => ({
    amount: "",
    reason: "ROUND_OFF",
    note: "",
    error: "",
  });

  const [form, setForm] = useState(getInitialState);

  const handleClose = () => {
    setForm(getInitialState());

    onClose();
  };

  const handleSubmit = async () => {
    setForm((prev) => ({
      ...prev,
      error: "",
    }));

    const value = Number(form.amount);

    if (!(value > 0)) {
      return setForm((prev) => ({
        ...prev,
        error: "Enter valid adjustment amount.",
      }));
    }

    if (value > (customer?.currentDue || 0)) {
      return setForm((prev) => ({
        ...prev,
        error: "Adjustment cannot exceed current due.",
      }));
    }

    try {
      await onSubmit({
        amount: value,
        reason: form.reason,
        note: form.note,
      });

      handleClose();
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to save adjustment.",
      }));
    }
  };

  return (
    <Modal open={open} title="Customer Adjustment" onClose={onClose}>
      <div className="adjustment-form">
        <div className="adjustment-due">
          Current Due :
          <strong>
            ₹{Number(customer?.currentDue || 0).toLocaleString("en-IN")}
          </strong>
        </div>

        <FormField
          type="number"
          placeholder="Adjustment Amount"
          value={form.amount}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              amount: e.target.value,
            }))
          }
        />

        <label className="adjustment-label">Reason</label>

        <select
          className="adjustment-select"
          value={form.reason}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              reason: e.target.value,
            }))
          }
        >
          {REASONS.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <FormField
          placeholder="Note (Optional)"
          value={form.note}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              note: e.target.value,
            }))
          }
        />

        {form.error && <div className="adjustment-error">{form.error}</div>}

        <div className="adjustment-actions">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Adjustment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AdjustmentModal;
