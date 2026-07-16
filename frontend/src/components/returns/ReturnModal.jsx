import { useEffect, useMemo, useState } from "react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

import "./ReturnModal.css";

function ReturnModal({ open, onClose, onSubmit, bill, loading }) {
  const [productId, setProductId] = useState("");

  const [qty, setQty] = useState("");

  const [reason, setReason] = useState("Customer Return");

  const [error, setError] = useState("");

  const returnableProducts = useMemo(() => {
    if (!bill) return [];

    return bill.items.filter((item) => item.qty > item.returnedQty);
  }, [bill]);

  useEffect(() => {
    if (!open) return;

    if (returnableProducts.length > 0) {
      setProductId(returnableProducts[0].productId);
    } else {
      setProductId("");
    }

    setQty("");

    setReason("Customer Return");

    setError("");
  }, [open, returnableProducts]);

  const selectedProduct = returnableProducts.find(
    (item) => String(item.productId) === String(productId),
  );

  const remainingQty = selectedProduct
    ? selectedProduct.qty - selectedProduct.returnedQty
    : 0;

  const handleSubmit = async () => {
    setError("");

    if (!productId) {
      return setError("Please select a product.");
    }

    if (!qty || Number(qty) <= 0) {
      return setError("Enter valid quantity.");
    }

    if (Number(qty) > remainingQty) {
      return setError(`Maximum return quantity is ${remainingQty}.`);
    }

    try {
      await onSubmit({
        productId,
        qty: Number(qty),
        reason,
      });

      setProductId("");

      setQty("");

      setReason("Customer Return");

      setError("");

      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Return failed");
    }
  };

  return (
    <Modal open={open} title="Return Product" onClose={onClose}>
      {returnableProducts.length === 0 ? (
        <>
          <p>All products have already been returned.</p>

          <div className="return-actions">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="return-form">
            <label>Product</label>

            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {returnableProducts.map((item) => (
                <option key={item.productId} value={item.productId}>
                  {item.productName}
                  {" | "}
                  Remaining : {item.qty - item.returnedQty}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className="return-info">
                <div>Sold Qty : {selectedProduct.qty}</div>

                <div>Returned : {selectedProduct.returnedQty}</div>

                <div>Remaining : {remainingQty}</div>
              </div>
            )}

            <FormField
              type="number"
              placeholder="Return Quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />

            <FormField
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            {error && <div className="return-error">{error}</div>}
          </div>

          <div className="return-actions">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button loading={loading} onClick={handleSubmit}>
              Save Return
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default ReturnModal;
