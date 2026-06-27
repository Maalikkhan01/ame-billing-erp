import { useEffect, useState } from "react";

import { searchCustomers } from "../services/customerService";
import { searchProducts } from "../services/productService";

import {
  createHoldBill,
  updateHoldBill,
  deleteHoldBill,
} from "../services/holdBillService";

import { createBill } from "../services/billingService";

function useBilling({ resumeData, navigate }) {
  const [customerId, setCustomerId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  const [productId, setProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [qty, setQty] = useState(1);

  const [unitType, setUnitType] = useState("PIECE");

  const [items, setItems] = useState([]);

  const [customerResults, setCustomerResults] = useState([]);
  const [productResults, setProductResults] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const [holdBillId, setHoldBillId] = useState(null);

  const [savingBill, setSavingBill] = useState(false);
  const [holdingBill, setHoldingBill] = useState(false);

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

  const addItem = () => {
    if (!productId) {
      alert("Select Product");
      return;
    }

    const product = selectedProduct;

    if (!product) return;

    const selectedUnit = product.units?.find((unit) => unit.type === unitType);

    if (!selectedUnit) {
      alert("Selected unit not available");
      return;
    }

    const rate = selectedUnit.price;
    const existing = items.find(
      (item) => item.productId === product._id && item.unitType === unitType,
    );

    if (existing) {
      setItems(
        items.map((item) =>
          item.productId === product._id && item.unitType === unitType
            ? {
                ...item,
                qty: item.qty + Number(qty),
                amount: (item.qty + Number(qty)) * item.rate,
              }
            : item,
        ),
      );
    } else {
      setItems([
        ...items,
        {
          productId: product._id,
          productName: product.name,
          unitType,
          qty: Number(qty),
          rate,
          amount: rate * Number(qty),
        },
      ]);
    }

    setQty(1);
    setProductId("");
    setProductSearch("");
    setSelectedProduct(null);
    setUnitType("");
  };

  const removeItem = (productId, unitType) => {
    setItems(
      items.filter(
        (item) => !(item.productId === productId && item.unitType === unitType),
      ),
    );
  };

  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);

  const holdBill = async () => {
    if (holdingBill) return;

    setHoldingBill(true);

    try {
      const payload = {
        customerId,
        customerName: selectedCustomer?.name || customerSearch,
        items,
        grandTotal,
      };

      if (holdBillId) {
        await updateHoldBill(holdBillId, payload);
      } else {
        await createHoldBill(payload);
      }

      navigate("/hold-bills");
    } finally {
      setHoldingBill(false);
    }
  };

  const saveBill = async () => {
    if (savingBill) return;

    setSavingBill(true);

    try {
      const response = await createBill({
        customerId,

        items: items.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          unitType: item.unitType,
        })),
      });

      if (holdBillId) {
        await deleteHoldBill(holdBillId);
      }

      navigate(`/invoice/${response.bill._id}`);
    } finally {
      setSavingBill(false);
    }
  };

  return {
    customerId,
    setCustomerId,

    customerSearch,
    setCustomerSearch,

    customerResults,
    selectedCustomer,
    setSelectedCustomer,

    selectedCustomerIndex,
    setSelectedCustomerIndex,

    productId,
    setProductId,

    productSearch,
    setProductSearch,

    productResults,

    selectedProduct,
    setSelectedProduct,

    selectedProductIndex,
    setSelectedProductIndex,

    qty,
    setQty,

    unitType,
    setUnitType,

    items,
    setItems,

    grandTotal,

    addItem,
    removeItem,

    saveBill,
    holdBill,

    savingBill,
    holdingBill,
  };
}

export default useBilling;
