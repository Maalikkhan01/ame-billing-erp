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

  addItem,
}) {
  const itemRefs = useRef([]);

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
              }

              unitRef.current?.focus();
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
                }

                unitRef.current?.focus();
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
            onChange={(e) => setUnitType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                qtyRef.current?.focus();
              }
            }}
          >
            {selectedProduct?.units?.map((unit) => (
              <option key={unit.type} value={unit.type}>
                {unit.type}
              </option>
            ))}
          </FormField>
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
      </div>

      <Button className="add-item-btn" onClick={addItem}>
        Add Item
      </Button>
    </Card>
  );
}

export default ProductSelector;
