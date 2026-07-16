import { useEffect, useState } from "react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

import "./ReceivePaymentModal.css";

function ReceivePaymentModal({ open, onClose, onSubmit, loading, customer }) {
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setAmount(customer?.currentDue || "");
    setPaymentMode("CASH");
    setNote("");
    setError("");
  }, [open, customer]);

  const handleSubmit = async () => {
    setError("");

    if (!amount || Number(amount) <= 0) {
      return setError("Enter a valid amount.");
    }

    if (Number(amount) > customer.currentDue) {
      return setError("Amount cannot exceed current due.");
    }

    try {
      await onSubmit({
        amount: Number(amount),
        paymentMode,
        note,
      });

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment failed");
    }
  };

  return (
    <Modal open={open} title="Receive Payment" onClose={onClose}>
      <div className="payment-form">
        <div className="payment-due-box">
          Current Due
          <strong>₹{customer?.currentDue || 0}</strong>
        </div>

        <FormField
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Payment Mode</label>

        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="BANK">Bank</option>
        </select>

        <FormField
          placeholder="Note (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error && <div className="payment-error">{error}</div>}

        <div className="payment-actions">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button loading={loading} onClick={handleSubmit}>
            Receive Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ReceivePaymentModal;
