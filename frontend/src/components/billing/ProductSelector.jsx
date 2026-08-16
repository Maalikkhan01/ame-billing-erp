import { useEffect, useRef, useState } from "react";

import Card from "../ui/Card";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

function ProductSelector({
  productSearchRef,
  qtyRef,
  unitRef,

  productSearch,
  setProductSearch,

  productResults,

  productId,
  setProductId,

  selectedProduct,
  setSelectedProduct,

  selectedProductIndex,
  setSelectedProductIndex,

  unitType,
  setUnitType,

  qty,
  setQty,

  rate,
  setRate,

  subtotal,

  addItem,
}) {
  const itemRefs = useRef([]);
  const unitItemRefs = useRef([]);
  const rateRef = useRef(null);

  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);

  // Auto-scroll for product list
  useEffect(() => {
    itemRefs.current[selectedProductIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedProductIndex]);

  // Auto-scroll for unit list
  useEffect(() => {
    if (isUnitDropdownOpen) {
      unitItemRefs.current[selectedUnitIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedUnitIndex, isUnitDropdownOpen]);

  // Unit final selection logic
  const handleUnitSelect = (unit) => {
    if (!unit) return;
    setUnitType(unit.type);
    setRate(unit.price);
    setIsUnitDropdownOpen(false);

    // Unit finalize hone ke baad Quantity par focus bhejo aur text select karo
    requestAnimationFrame(() => {
      qtyRef.current?.focus();
      qtyRef.current?.select();
    });
  };

  // Product selection logic
  const handleProductSelect = (product) => {
    if (!product) return;

    setProductId(product._id);
    setSelectedProduct(product);
    setProductSearch(product.name);
    setSelectedProductIndex(0);

    if (product.units?.length > 0) {
      setUnitType(product.units[0].type);
      setRate(product.units[0].price);
      setSelectedUnitIndex(0);
      setIsUnitDropdownOpen(true); // Product select hote hi Unit list auto open hogi
    }

    requestAnimationFrame(() => {
      unitRef.current?.focus();
    });
  };

  // Add Item & Reset Focus logic
  const handleAddItem = () => {
    addItem();
    setIsUnitDropdownOpen(false);
    requestAnimationFrame(() => {
      productSearchRef.current?.focus();
    });
  };

  return (
    <Card title="Add Product">
      <FormField
        ref={productSearchRef}
        placeholder="Type product name..."
        value={productSearch}
        onChange={(e) => {
          setProductSearch(e.target.value);
          setProductId("");
          setSelectedProduct(null);
          setIsUnitDropdownOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && productResults.length > 0) {
            e.preventDefault();
            setSelectedProductIndex((prev) =>
              Math.min(prev + 1, productResults.length - 1),
            );
          }

          if (e.key === "ArrowUp" && productResults.length > 0) {
            e.preventDefault();
            setSelectedProductIndex((prev) => Math.max(prev - 1, 0));
          }

          if (e.key === "Enter") {
            e.preventDefault();
            const product =
              productResults[selectedProductIndex] || productResults[0];

            if (product) {
              handleProductSelect(product);
            }
          }

          if (e.key === "Escape") {
            setSelectedProductIndex(0);
          }
        }}
      />

      {/* PRODUCT SEARCH DROPDOWN */}
      {productSearch && productId === "" && (
        <div className="product-dropdown">
          {productResults.map((product, index) => (
            <div
              key={product._id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`dropdown-item ${
                index === selectedProductIndex ? "dropdown-active" : ""
              }`}
              onClick={() => handleProductSelect(product)}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}

      <div className="billing-grid">
        {/* CUSTOM AUTO-OPEN UNIT SELECTION */}
        <div style={{ position: "relative" }}>
          <label>Unit Type</label>

          <FormField
            ref={unitRef}
            readOnly
            value={unitType || ""}
            placeholder="Select Unit"
            onFocus={() => {
              if (selectedProduct?.units?.length > 0) {
                setIsUnitDropdownOpen(true);
              }
            }}
            onClick={() => {
              if (selectedProduct?.units?.length > 0) {
                setIsUnitDropdownOpen((prev) => !prev);
              }
            }}
            onKeyDown={(e) => {
              const units = selectedProduct?.units || [];
              if (units.length === 0) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIsUnitDropdownOpen(true);
                setSelectedUnitIndex((prev) =>
                  Math.min(prev + 1, units.length - 1),
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIsUnitDropdownOpen(true);
                setSelectedUnitIndex((prev) => Math.max(prev - 1, 0));
              }

              if (e.key === "Enter") {
                e.preventDefault();
                const unit = units[selectedUnitIndex] || units[0];
                handleUnitSelect(unit);
              }

              if (e.key === "Escape") {
                setIsUnitDropdownOpen(false);
              }
            }}
          />

          {/* UNIT DROPDOWN MENU */}
          {isUnitDropdownOpen && selectedProduct?.units?.length > 0 && (
            <div className="product-dropdown" style={{ zIndex: 10 }}>
              {selectedProduct.units.map((unit, index) => (
                <div
                  key={unit.type}
                  ref={(el) => (unitItemRefs.current[index] = el)}
                  className={`dropdown-item ${
                    index === selectedUnitIndex ? "dropdown-active" : ""
                  }`}
                  onClick={() => handleUnitSelect(unit)}
                >
                  {unit.type} | Cost ₹{unit.costPrice} | Sell ₹{unit.price}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RATE (EDITABLE BUT SKIPPED IN KEYBOARD WORKFLOW) */}
        <div>
          <label>Rate</label>

          <FormField
            ref={rateRef}
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                qtyRef.current?.focus();
                qtyRef.current?.select();
              }
            }}
          />
        </div>

        {/* QUANTITY */}
        <div>
          <label>Quantity</label>

          <FormField
            ref={qtyRef}
            type="number"
            step="0.001"
            min="0.001"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem();
              }
            }}
          />
        </div>

        <div className="billing-subtotal">
          <strong>Subtotal :</strong> ₹
          {new Intl.NumberFormat("en-IN").format(subtotal)}
        </div>
      </div>

      <Button className="add-item-btn" onClick={handleAddItem}>
        Add Item
      </Button>
    </Card>
  );
}

export default ProductSelector;
