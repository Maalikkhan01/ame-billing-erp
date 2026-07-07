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

    page,
    totalPages,
    totalProducts,
    loadProducts,
  } = useProducts();

  const createDefaultUnits = () => [
    { type: "PIECE", enabled: true, price: "" },
    { type: "PACKET", enabled: false, price: "" },
    { type: "GRAM", enabled: false, price: "" },
    { type: "KG", enabled: false, price: "" },
    { type: "SET", enabled: false, price: "" },
    { type: "OUTER", enabled: false, price: "" },
    { type: "BOX", enabled: false, price: "" },
    { type: "BAG", enabled: false, price: "" },
  ];

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [units, setUnits] = useState(createDefaultUnits());

  const [search, setSearch] = useState("");

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addProduct({
      name,
      description,

      units: units
        .filter((unit) => unit.enabled)
        .map((unit) => ({
          type: unit.type,
          price: Number(unit.price),
        })),
    });

    setName("");
    setDescription("");
    setUnits(createDefaultUnits());

    nameRef.current?.focus();
  };

  return (
    <MainLayout>
      <PageHeader title="Products" subtitle={`${totalProducts} Items`} />

      <Card title="Add Product">
        <form onSubmit={handleSubmit}>
          <div className="product-form-grid">
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
                          updated[index].price = "";
                        }

                        setUnits(updated);
                      }}
                    />

                    {unit.type}
                  </label>

                  {unit.enabled && (
                    <FormField
                      type="number"
                      placeholder={`${unit.type} Price`}
                      value={unit.price}
                      onChange={(e) => {
                        const updated = [...units];

                        updated[index].price = e.target.value;

                        setUnits(updated);
                      }}
                    />
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
          value={search}
          placeholder="Search product..."
          onChange={(value) => {
            setSearch(value);

            searchProductList(value);
          }}
        />
        <div className="product-count">Showing {totalProducts} Products</div>
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
                  <th>Units</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>

                    <td>
                      {product.units
                        ?.map((unit) => `${unit.type} (₹${unit.price})`)
                        .join(", ")}
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
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </Card>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrevious={() => loadProducts(page - 1)}
        onNext={() => loadProducts(page + 1)}
      />
    </MainLayout>
  );
}

export default ProductsPage;
