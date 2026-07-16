import { useEffect, useRef } from "react";

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
  const rateRef = useRef(null);

  useEffect(() => {
    itemRefs.current[selectedProductIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedProductIndex]);

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
            e.preventDefault();

            const product = productResults[selectedProductIndex];

            if (product) {
              setProductId(product._id);
              setSelectedProduct(product);
              setProductSearch(product.name);

              if (product.units?.length > 0) {
                setUnitType(product.units[0].type);
                setRate(product.units[0].price);
              }

              rateRef.current?.focus();
              rateRef.current?.select();
            }
          }

          if (e.key === "Escape") {
            setSelectedProductIndex(0);
          }
        }}
      />

      {productSearch && productId === "" && (
        <div className="product-dropdown">
          {productResults.map((product, index) => (
            <div
              key={product._id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`dropdown-item ${
                index === selectedProductIndex ? "dropdown-active" : ""
              }`}
              onClick={() => {
                setProductId(product._id);

                setSelectedProduct(product);

                setProductSearch(product.name);

                if (product.units?.length > 0) {
                  setUnitType(product.units[0].type);
                  setRate(product.units[0].price);
                }

                rateRef.current?.focus();
                rateRef.current?.select();
              }}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}

      <div className="billing-grid">
        <div>
          <label>Unit Type</label>

          <FormField
            as="select"
            ref={unitRef}
            value={unitType}
            onChange={(e) => {
              const value = e.target.value;

              setUnitType(value);

              const selectedUnit = selectedProduct?.units?.find(
                (unit) => unit.type === value,
              );

              if (selectedUnit) {
                setRate(selectedUnit.price);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                rateRef.current?.focus();
              }
            }}
          >
            {selectedProduct?.units?.map((unit) => (
              <option key={unit.type} value={unit.type}>
                {unit.type} | Cost ₹{unit.costPrice} | Sell ₹{unit.price}
              </option>
            ))}
          </FormField>
        </div>
        <div>
          <label>Rate</label>

          <FormField
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                qtyRef.current?.focus();
              }
            }}
            ref={rateRef}
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div>
          <label>Quantity</label>

          <FormField
            ref={qtyRef}
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
          />
        </div>

        <div className="billing-subtotal">
          <strong>Subtotal :</strong> ₹
          {new Intl.NumberFormat("en-IN").format(subtotal)}
        </div>
      </div>

      <Button className="add-item-btn" onClick={addItem}>
        Add Item
      </Button>
    </Card>
  );
}

export default ProductSelector;
