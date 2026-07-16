import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import CustomerSelector from "../../components/billing/CustomerSelector";
import BillSummaryCard from "../../components/billing/BillSummaryCard";
import ProductSelector from "../../components/billing/ProductSelector";

import BillingItemsTable from "../../components/billing/BillingItemsTable";

import BillActions from "../../components/billing/BillActions";

import "./BillingPage.css";

import { searchCustomers } from "../../services/customerService";

import { searchProducts } from "../../services/productService";
import PageHeader from "../../components/ui/PageHeader";

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

  const [rate, setRate] = useState("");
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const selectedUnit = product.units?.find((unit) => unit.type === unitType);

    if (!selectedUnit) {
      alert("Selected unit not found");
      return;
    }

    const currentRate = Number(rate);

    if (currentRate <= 0) {
      alert("Enter valid rate");
      return;
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
            totalProfit: item.profitPerUnit * newQty,
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
          rate: currentRate,
          qty: Number(qty),
          amount: currentRate * Number(qty),
        },
      ]);
    }

    setQty(1);
    setRate("");
    setUnitType("PIECE");

    setProductId("");
    setProductSearch("");
    setSelectedProduct(null);
    setProductResults([]);

    productSearchRef.current?.focus();
  };

  // Hold Bill Create / Update
  async function handleHoldBill() {
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
      setRate("");
      setUnitType("PIECE");

      navigate("/hold-bills");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed To Hold Bill");
    } finally {
      setHoldingBill(false);
    }
  }

  const removeItem = (productId, unitType) => {
    setItems(
      items.filter(
        (item) => !(item.productId === productId && item.unitType === unitType),
      ),
    );
  };

  const subtotal = Number(rate || 0) * Number(qty || 0);
  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const totalProfit = items.reduce(
    (sum, item) => sum + (item.totalProfit || 0),
    0,
  );
  // Create New Hold Bill OR Update Existing Hold Bill
  async function handleSave() {
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
      setRate("");
      setUnitType("PIECE");
      setHoldBillId(null);

      navigate(`/invoice/${response.bill._id}`);
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to create bill");
    } finally {
      setSavingBill(false);
    }
  }

  return (
    <MainLayout>
      <PageHeader
        title="Billing"
        subtitle="Create invoices and manage customer billing"
      />
      <div className="billing-top-section">
        {/* Customer Card */}

        <CustomerSelector
          customerSearchRef={customerSearchRef}
          productSearchRef={productSearchRef}
          customerSearch={customerSearch}
          setCustomerSearch={setCustomerSearch}
          customerResults={customerResults}
          customerId={customerId}
          setCustomerId={setCustomerId}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          selectedCustomerIndex={selectedCustomerIndex}
          setSelectedCustomerIndex={setSelectedCustomerIndex}
        />

        {/* Summary Card */}

        <BillSummaryCard
          totalItems={items.length}
          grandTotal={grandTotal}
          totalProfit={totalProfit}
        />
      </div>
      <ProductSelector
        productSearchRef={productSearchRef}
        qtyRef={qtyRef}
        unitRef={unitRef}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        productResults={productResults}
        productId={productId}
        setProductId={setProductId}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedProductIndex={selectedProductIndex}
        setSelectedProductIndex={setSelectedProductIndex}
        unitType={unitType}
        setUnitType={setUnitType}
        qty={qty}
        setQty={setQty}
        rate={rate}
        setRate={setRate}
        subtotal={subtotal}
        addItem={addItem}
      />

      <BillingItemsTable
        items={items}
        setItems={setItems}
        removeItem={removeItem}
      />

      <BillActions
        items={items}
        holdingBill={holdingBill}
        savingBill={savingBill}
        handleHoldBill={handleHoldBill}
        handleSave={handleSave}
      />
    </MainLayout>
  );
}

export default BillingPage;
