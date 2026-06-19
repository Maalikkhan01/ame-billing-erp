import { useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import "./ProductsPage.css";

import useProducts from "../../hooks/useProducts";

import { Link } from "react-router-dom";

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

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [piecePrice, setPiecePrice] = useState("");

  const [hasPacking, setHasPacking] = useState(false);

  const [packingType, setPackingType] = useState("BOX");

  const [packingQty, setPackingQty] = useState("");

  const [packingPrice, setPackingPrice] = useState("");

  const [search, setSearch] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addProduct({
      name,
      description,
      piecePrice: Number(piecePrice),
      hasPacking,
      packingType,
      packingQty: Number(packingQty),
      packingPrice: Number(packingPrice),
    });

    setName("");
    setDescription("");
    setPiecePrice("");
    setHasPacking(false);
    setPackingType("BOX");
    setPackingQty("");
    setPackingPrice("");
  };

  return (
    <MainLayout>
      <div className="page-header">
        <h1>Products</h1>
        <span>{totalProducts} Items</span>
      </div>

      <div className="product-form-card">
        <form onSubmit={handleSubmit}>
          <div className="product-form-grid">
            <input
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              placeholder="Piece Price"
              value={piecePrice}
              onChange={(e) => setPiecePrice(e.target.value)}
            />

            <label className="packing-checkbox">
              <input
                type="checkbox"
                checked={hasPacking}
                onChange={(e) => setHasPacking(e.target.checked)}
              />
              Has Box / Bag Packing
            </label>

            {hasPacking && (
              <>
                <select
                  value={packingType}
                  onChange={(e) => setPackingType(e.target.value)}
                >
                  <option value="BOX">BOX</option>

                  <option value="BAG">BAG</option>
                </select>

                <input
                  type="number"
                  placeholder="Packing Quantity"
                  value={packingQty}
                  onChange={(e) => setPackingQty(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Packing Price"
                  value={packingPrice}
                  onChange={(e) => setPackingPrice(e.target.value)}
                />
              </>
            )}
          </div>

          <button className="product-submit-btn" type="submit">
            Add Product
          </button>
        </form>
      </div>

      <div className="search-card">
        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            searchProductList(e.target.value);
          }}
        />
      </div>
      <div className="product-count">Showing {totalProducts} Products</div>

      {loading ? (
        <h3>Loading Products...</h3>
      ) : products.length === 0 ? (
        <h3>No Products Found</h3>
      ) : (
        <div className="product-table-card">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Piece Price</th>
                <th>Packing</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>

                  <td>₹{product.piecePrice}</td>

                  <td>{product.hasPacking ? product.packingType : "-"}</td>

                  <td>{product.hasPacking ? product.packingQty : "-"}</td>

                  <td>
                    <Link to={`/products/${product._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => loadProducts(page - 1)}>
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => loadProducts(page + 1)}
        >
          Next
        </button>
      </div>
    </MainLayout>
  );
}

export default ProductsPage;
