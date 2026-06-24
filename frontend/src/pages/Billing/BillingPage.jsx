import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import "./BillingPage.css";

import { searchCustomers } from "../../services/customerService";

import { searchProducts } from "../../services/productService";

import {
  createHoldBill,
  updateHoldBill,
  deleteHoldBill,
} from "../../services/holdBillService";
import { createBill } from "../../services/billingService";

function BillingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const productSearchRef = useRef(null);
  const qtyRef = useRef(null);
  const customerSearchRef = useRef(null);
  const unitRef = useRef(null);

  const [customerId, setCustomerId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [items, setItems] = useState([]);
  const [holdBillId, setHoldBillId] = useState(null);
  const [savingBill, setSavingBill] = useState(false);

  const [holdingBill, setHoldingBill] = useState(false);
  const resumeData = location.state?.holdBill;

  const [unitType, setUnitType] = useState("PIECE");

  const [customerResults, setCustomerResults] = useState([]);
  const [productResults, setProductResults] = useState([]);

  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  // Resume Hold Bill Data
  useEffect(() => {
    if (!resumeData) return;

    const customerIdValue =
      typeof resumeData.customerId === "object"
        ? resumeData.customerId._id
        : resumeData.customerId;

    setCustomerId(customerIdValue);
    setCustomerSearch(resumeData.customerName || "");
    setItems(resumeData.items || []);
    setHoldBillId(resumeData._id || null);
  }, [resumeData]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!customerSearch.trim()) {
        setCustomerResults([]);
        return;
      }

      try {
        const data = await searchCustomers(customerSearch);

        setCustomerResults(data.customers || []);
      } catch (error) {
        console.error(error);

        setCustomerResults([]);
      }
      setSelectedCustomerIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [customerSearch]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!productSearch.trim()) {
        setProductResults([]);
        return;
      }

      try {
        const data = await searchProducts(productSearch);

        setProductResults(data.products || []);
      } catch (error) {
        console.error(error);

        setProductResults([]);
      }

      setSelectedProductIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [productSearch]);

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();

        handleSave();
      }

      if (e.ctrlKey && e.key.toLowerCase() === "h") {
        e.preventDefault();

        handleHoldBill();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [customerId, items]);

  const addItem = () => {
    if (!productId) {
      alert("Select Product");
      return;
    }

    if (Number(qty) <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (Number(qty) > 10000) {
      alert("Quantity too large");
      return;
    }

    const product = selectedProduct;

    if (!product) return;

    let rate = 0;

    if (unitType === "PIECE") {
      rate = product.piecePrice;
    } else {
      rate = product.packingPrice;
    }

    const existingItem = items.find(
      (item) => item.productId === product._id && item.unitType === unitType,
    );

    if (existingItem) {
      const updatedItems = items.map((item) => {
        if (item.productId === product._id && item.unitType === unitType) {
          const newQty = item.qty + Number(qty);

          return {
            ...item,
            qty: newQty,
            amount: newQty * item.rate,
          };
        }

        return item;
      });

      setItems(updatedItems);
    } else {
      setItems([
        ...items,
        {
          productId: product._id,

          productName: product.name,

          unitType,

          rate,

          qty: Number(qty),

          amount: rate * Number(qty),
        },
      ]);
    }

    setQty(1);

    setUnitType("PIECE");

    setProductId("");
    setProductSearch("");
    setSelectedProduct(null);
    setProductResults([]);

    productSearchRef.current?.focus();
  };

  // Hold Bill Create / Update
  const handleHoldBill = async () => {
    if (holdingBill) return;

    if (!customerId) {
      alert("Select Customer");
      return;
    }

    if (items.length === 0) {
      alert("Add Items First");
      return;
    }

    setHoldingBill(true);

    try {
      const customer = selectedCustomer;

      const payload = {
        customerId,
        customerName: customer?.name || customerSearch,
        items,
        grandTotal,
      };

      if (holdBillId) {
        await updateHoldBill(holdBillId, payload);

        alert("Hold Bill Updated");
      } else {
        await createHoldBill(payload);

        alert("Bill Hold Successfully");
      }

      setCustomerId("");
      setCustomerSearch("");
      setProductId("");
      setProductSearch("");
      setQty(1);
      setItems([]);
      setHoldBillId(null);

      navigate("/hold-bills");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed To Hold Bill");
    } finally {
      setHoldingBill(false);
    }
  };

  const removeItem = (productId, unitType) => {
    setItems(
      items.filter(
        (item) => !(item.productId === productId && item.unitType === unitType),
      ),
    );
  };

  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);
  // Create New Hold Bill OR Update Existing Hold Bill
  const handleSave = async () => {
    if (savingBill) return;

    if (!customerId) {
      alert("Select Customer");
      return;
    }

    if (items.length === 0) {
      alert("Add at least one product");
      return;
    }

    setSavingBill(true);

    try {
      const response = await createBill({
        customerId,

        items: items.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          unitType: item.unitType,
          rate: item.rate,
        })),
      });

      // Resume Hold Bill tha to delete kar do
      if (holdBillId) {
        await deleteHoldBill(holdBillId);
      }

      alert("Bill Created");

      setItems([]);
      setCustomerId("");
      setCustomerSearch("");
      setProductId("");
      setProductSearch("");
      setQty(1);
      setHoldBillId(null);

      navigate(`/invoice/${response.bill._id}`);
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to create bill");
    } finally {
      setSavingBill(false);
    }
  };

  return (
    <MainLayout>
      <h1>Billing</h1>
      <div className="billing-top-section">
        {/* Customer Card */}

        <div className="billing-card">
          <h3>Customer</h3>

          <input
            ref={customerSearchRef}
            type="text"
            className="billing-input"
            placeholder="Search customer..."
            value={customerSearch}
            onChange={(e) => {
              setCustomerSearch(e.target.value);
              setCustomerId("");
              setSelectedCustomer(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();

                setSelectedCustomerIndex((prev) =>
                  Math.min(prev + 1, customerResults.length - 1),
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();

                setSelectedCustomerIndex((prev) => Math.max(prev - 1, 0));
              }

              if (e.key === "Enter") {
                const customer = customerResults[selectedCustomerIndex];

                if (customer) {
                  setCustomerId(customer._id);
                  setSelectedCustomer(customer);
                  setCustomerSearch(customer.name);
                  setCustomerResults([]);

                  productSearchRef.current?.focus();
                }
              }
              if (e.key === "Escape") {
                setCustomerResults([]);
              }
            }}
          />

          {customerSearch && customerId === "" && (
            <div className="customer-dropdown">
              {customerResults.map((customer, index) => (
                <div
                  key={customer._id}
                  className={`dropdown-item ${
                    index === selectedCustomerIndex ? "dropdown-active" : ""
                  }`}
                  onClick={() => {
                    setCustomerId(customer._id);
                    setSelectedCustomer(customer);
                    setCustomerSearch(customer.name);
                    setCustomerResults([]);
                  }}
                >
                  {customer.name}
                </div>
              ))}
            </div>
          )}

          {selectedCustomer && (
            <div className="customer-details">
              <span>Name: {selectedCustomer.name}</span>

              <span>Mobile: {selectedCustomer.mobile}</span>

              <span>
                Due: ₹
                {Number(selectedCustomer.currentDue || 0).toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
          )}
        </div>

        {/* Summary Card */}

        <div className="summary-card bill-summary-card">
          <h3>Bill Summary</h3>

          <p>Total Items</p>

          <h2>{items.length}</h2>

          <br />

          <p>Grand Total</p>

          <h1 className="summary-total">
            ₹{Number(grandTotal).toLocaleString("en-IN")}
          </h1>
        </div>
      </div>
      <br />
      <div className="billing-card">
        <h3>Add Product</h3>

        <input
          ref={productSearchRef}
          type="text"
          className="billing-input"
          placeholder="Type product name..."
          value={productSearch}
          onChange={(e) => {
            setProductSearch(e.target.value);
            setProductId("");
            setSelectedProduct(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();

              setSelectedProductIndex((prev) =>
                Math.min(prev + 1, productResults.length - 1),
              );
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();

              setSelectedProductIndex((prev) => Math.max(prev - 1, 0));
            }

            if (e.key === "Enter") {
              const product = productResults[selectedProductIndex];

              if (product) {
                setProductId(product._id);
                setSelectedProduct(product);
                setProductSearch(product.name);
                setProductResults([]);

                unitRef.current?.focus();
              }
            }
            if (e.key === "Escape") {
              setProductResults([]);
            }
          }}
        />

        {productSearch && productId === "" && (
          <div className="product-dropdown">
            {productResults.map((product, index) => (
              <div
                key={product._id}
                className={`dropdown-item ${
                  index === selectedProductIndex ? "dropdown-active" : ""
                }`}
                onClick={() => {
                  setProductId(product._id);
                  setSelectedProduct(product);
                  setProductSearch(product.name);
                  setProductResults([]);
                }}
              >
                {product.name}
              </div>
            ))}
          </div>
        )}

        <br />

        <div className="billing-grid">
          <div>
            <label>Unit Type</label>

            <select
              ref={unitRef}
              className="billing-select"
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  qtyRef.current?.focus();
                }
              }}
            >
              <option value="PIECE">PIECE</option>

              {selectedProduct?.hasPacking && (
                <option value={selectedProduct.packingType}>
                  {selectedProduct.packingType}
                </option>
              )}
            </select>
          </div>

          <div>
            <label>Quantity</label>

            <input
              ref={qtyRef}
              type="number"
              min=""
              className="billing-input"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addItem();
                }
              }}
            />
          </div>
        </div>

        <br />

        <button className="add-item-btn" onClick={addItem}>
          Add Item
        </button>
      </div>
      <br />
      <br />

      <div className="billing-card">
        <h3>Billing Items</h3>

        <div className="billing-table-wrapper">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Product</th>

                <th>Unit</th>

                <th>Qty</th>

                <th>Rate</th>

                <th>Amount</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>

                  <td>{item.unitType}</td>

                  <td>
                    <input
                      type="number"
                      min="1"
                      className="qty-input"
                      value={item.qty}
                      onChange={(e) => {
                        const newQty = Number(e.target.value);

                        setItems((prev) =>
                          prev.map((row, rowIndex) =>
                            rowIndex === index
                              ? {
                                  ...row,
                                  qty: newQty,
                                  amount: row.rate * newQty,
                                }
                              : row,
                          ),
                        );
                      }}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      className="rate-input"
                      value={item.rate}
                      onChange={(e) => {
                        const newRate = Number(e.target.value);

                        setItems((prev) =>
                          prev.map((row, rowIndex) =>
                            rowIndex === index
                              ? {
                                  ...row,
                                  rate: newRate,
                                  amount: newRate * row.qty,
                                }
                              : row,
                          ),
                        );
                      }}
                    />
                  </td>

                  <td>₹{Number(item.amount).toLocaleString("en-IN")}</td>

                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.productId, item.unitType)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="summary-card bill-action-card">
        <h3>Bill Actions</h3>

        <div className="action-buttons">
          <button
            disabled={items.length === 0 || holdingBill}
            onClick={handleHoldBill}
            className="hold-btn"
          >
            {holdingBill ? "Holding..." : "Hold Bill"}
          </button>

          <button
            disabled={items.length === 0 || savingBill}
            onClick={handleSave}
            className="create-btn"
          >
            {savingBill ? "Creating..." : "Create Bill"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default BillingPage;
