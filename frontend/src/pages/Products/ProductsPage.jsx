import { useState, useRef } from "react";

import MainLayout from "../../components/layout/MainLayout";

import "./ProductsPage.css";

import useProducts from "../../hooks/useProducts";

import { Link } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import SearchInput from "../../components/ui/SearchInput";
import EmptyState from "../../components/ui/EmptyState";
import TableWrapper from "../../components/ui/TableWrapper";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

function ProductsPage() {
  const {
    products,
    loading,
    addProduct,
    searchProductList,
    filters,
    page,
    totalPages,
    totalProducts,
    loadProducts,
  } = useProducts();

  const createDefaultUnits = () => [
    {
      type: "PIECE",
      enabled: true,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "Ladi",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "PACKET",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "GRAM",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "KG",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "SET",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "Jar",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "OUTER",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "BOX",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },

    {
      type: "BAG",
      enabled: false,
      parentUnit: "",
      quantity: 1,
      openingStock: "",
      lowStockAlert: 5,
      mrp: "",
      costPrice: "",
      price: "",
    },
  ];

  const [measurementType, setMeasurementType] = useState("");

  const [category, setCategory] = useState("");

  const [brand, setBrand] = useState("");

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [units, setUnits] = useState(createDefaultUnits());

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!measurementType) {
      alert("Please select Measurement Type");
      return;
    }

    if (!category.trim()) {
      alert("Category is required");
      return;
    }

    if (!name.trim()) {
      alert("Product Name is required");
      return;
    }

    const productData = {
      measurementType,

      category,

      brand,

      name,

      description,
      units: units
        .filter((unit) => unit.enabled)
        .map((unit) => ({
          type: unit.type,

          parentUnit: unit.parentUnit || null,

          quantity: Number(unit.quantity || 1),

          openingStock: Number(unit.openingStock || 0),

          lowStockAlert: Number(unit.lowStockAlert || 5),

          mrp: Number(unit.mrp || 0),

          costPrice: Number(unit.costPrice || 0),

          price: Number(unit.price),
        })),
    };

    const enabledUnits = productData.units;

    for (const unit of enabledUnits) {
      if (unit.costPrice > unit.price) {
        alert(`${unit.type}: Cost Price cannot be greater than Selling Price`);
        return;
      }
    }

    try {
      await addProduct(productData);

      setMeasurementType("");

      setCategory("");

      setBrand("");

      setName("");

      setDescription("");

      setUnits(createDefaultUnits());
      nameRef.current?.focus();
    } catch {
      // Error already handled by addProduct/useProducts
      // Form clear nahi hoga
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Products" subtitle={`${totalProducts} Items`} />

      <Card title="Add Product">
        <form onSubmit={handleSubmit}>
          <div className="product-form-grid">
            <FormField
              as="select"
              value={measurementType}
              onChange={(e) => setMeasurementType(e.target.value)}
            >
              <option value="">Select Measurement Type</option>
              <option value="COUNT">COUNT</option>
              <option value="WEIGHT">WEIGHT</option>
              <option value="VOLUME">VOLUME</option>
              <option value="PACKED">PACKED</option>
            </FormField>

            <FormField
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <FormField
              placeholder="Brand (Optional)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <FormField
              ref={nameRef}
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  descriptionRef.current?.focus();
                }
              }}
            />

            <FormField
              as="textarea"
              ref={descriptionRef}
              placeholder="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.target.form?.requestSubmit();
                }
              }}
            />

            <div className="units-section">
              <h4>Available Units</h4>

              {units.map((unit, index) => (
                <div key={unit.type} className="unit-row">
                  <label className="unit-checkbox">
                    <input
                      type="checkbox"
                      checked={unit.enabled}
                      onChange={(e) => {
                        const updated = [...units];

                        updated[index].enabled = e.target.checked;

                        if (!e.target.checked) {
                          updated[index].mrp = "";
                          updated[index].costPrice = "";
                          updated[index].price = "";
                          updated[index].parentUnit = "";
                          updated[index].quantity = 1;
                          updated[index].openingStock = "";
                          updated[index].lowStockAlert = 5;
                        }

                        setUnits(updated);
                      }}
                    />

                    {unit.type}
                  </label>

                  {unit.enabled && (
                    <div className="unit-fields">
                      <FormField
                        as="select"
                        value={unit.parentUnit}
                        onChange={(e) => {
                          const updated = [...units];

                          updated[index].parentUnit = e.target.value;

                          if (!e.target.value) {
                            updated[index].quantity = 1;
                          }

                          setUnits(updated);
                        }}
                      >
                        <option value="">No Parent (Base Unit)</option>

                        {units
                          .filter((u) => u.enabled && u.type !== unit.type)
                          .map((u) => (
                            <option key={u.type} value={u.type}>
                              {u.type}
                            </option>
                          ))}
                      </FormField>

                      <FormField
                        type="number"
                        placeholder="Quantity"
                        value={unit.quantity}
                        disabled={!unit.parentUnit}
                        onChange={(e) => {
                          const updated = [...units];

                          updated[index].quantity = e.target.value;

                          setUnits(updated);
                        }}
                      />

                      <FormField
                        type="number"
                        placeholder="Opening Stock"
                        value={unit.openingStock}
                        onChange={(e) => {
                          const updated = [...units];

                          updated[index].openingStock = e.target.value;

                          setUnits(updated);
                        }}
                      />

                      <FormField
                        type="number"
                        placeholder="Low Stock Alert"
                        value={unit.lowStockAlert}
                        onChange={(e) => {
                          const updated = [...units];

                          updated[index].lowStockAlert = e.target.value;

                          setUnits(updated);
                        }}
                      />
                      <FormField
                        type="number"
                        placeholder="MRP"
                        value={unit.mrp}
                        onChange={(e) => {
                          const updated = [...units];

                          updated[index].mrp = e.target.value;

                          setUnits(updated);
                        }}
                      />

                      <FormField
                        type="number"
                        placeholder="Cost Price"
                        value={unit.costPrice}
                        onChange={(e) => {
                          const updated = [...units];

                          updated[index].costPrice = e.target.value;

                          setUnits(updated);
                        }}
                      />

                      <FormField
                        type="number"
                        placeholder="Selling Price"
                        value={unit.price}
                        onChange={(e) => {
                          const updated = [...units];

                          updated[index].price = e.target.value;

                          setUnits(updated);
                        }}
                      />

                      <div className="profit-preview">
                        <span>
                          Profit :
                          <strong>
                            ₹
                            {Math.max(
                              Number(unit.price || 0) -
                                Number(unit.costPrice || 0),
                              0,
                            )}
                          </strong>
                        </span>

                        <span>
                          Margin :
                          <strong>
                            {Number(unit.price || 0) > 0
                              ? (
                                  ((Number(unit.price || 0) -
                                    Number(unit.costPrice || 0)) /
                                    Number(unit.price || 0)) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button variant="success" type="submit" className="add-product-btn">
            Add Product
          </Button>
        </form>
      </Card>
      <div className="products-toolbar">
        <SearchInput
          value={filters.keyword}
          placeholder="Search Product..."
          onChange={(value) =>
            searchProductList({
              keyword: value,
            })
          }
        />

        <FormField
          as="input"
          placeholder="Category"
          value={filters.category}
          onChange={(e) =>
            searchProductList({
              category: e.target.value,
            })
          }
        />

        <FormField
          as="input"
          placeholder="Brand"
          value={filters.brand}
          onChange={(e) =>
            searchProductList({
              brand: e.target.value,
            })
          }
        />

        <FormField
          as="select"
          value={filters.measurementType}
          onChange={(e) =>
            searchProductList({
              measurementType: e.target.value,
            })
          }
        >
          <option value="">All Measurements</option>
          <option value="COUNT">COUNT</option>
          <option value="WEIGHT">WEIGHT</option>
          <option value="VOLUME">VOLUME</option>
          <option value="PACKED">PACKED</option>
        </FormField>

        <FormField
          as="select"
          value={filters.active}
          onChange={(e) =>
            searchProductList({
              active: e.target.value,
            })
          }
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </FormField>
      </div>
      {loading ? (
        <Card title="Products">
          <EmptyState text="Loading products..." />
        </Card>
      ) : products.length === 0 ? (
        <Card title="Products">
          <EmptyState text="No Products Found" />
        </Card>
      ) : (
        <Card title="Products">
          <TableWrapper>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Measurement</th>
                  <th>Total Units</th>
                  <th>Base Unit</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const baseUnit =
                    product.units?.find((u) => !u.parentUnit)?.type || "-";

                  return (
                    <tr key={product._id}>
                      <td>{product.name}</td>

                      <td>{product.category || "-"}</td>

                      <td>{product.brand || "-"}</td>

                      <td>{product.measurementType || "-"}</td>

                      <td>{product.units?.length || 0}</td>

                      <td>{baseUnit}</td>

                      <td>
                        {product.active ? (
                          <span className="status-active">Active</span>
                        ) : (
                          <span className="status-inactive">Inactive</span>
                        )}
                      </td>

                      <td>
                        <Button
                          as={Link}
                          to={`/products/${product._id}`}
                          variant="secondary"
                          size="sm"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrapper>
        </Card>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrevious={() => loadProducts(page - 1, filters)}
        onNext={() => loadProducts(page + 1, filters)}
      />
    </MainLayout>
  );
}

export default ProductsPage;
