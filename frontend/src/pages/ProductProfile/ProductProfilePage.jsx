import { useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import "./ProductProfilePage.css";

import useProductProfile from "../../hooks/useProductProfile";

import { updateProduct, deleteProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";

function ProductProfilePage() {
  const { id } = useParams();

  const { product, loading, refreshProduct } = useProductProfile(id);

  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    piecePrice: "",
    hasPacking: false,
    packingType: "BOX",
    packingQty: "",
    packingPrice: "",
  });

  if (loading) {
    return <MainLayout>Loading...</MainLayout>;
  }

  if (!product) {
    return <MainLayout>Product not found</MainLayout>;
  }

  const startEdit = () => {
    setFormData({
      name: product.name,
      description: product.description || "",

      piecePrice: product.piecePrice || "",

      hasPacking: product.hasPacking || false,

      packingType: product.packingType || "BOX",

      packingQty: product.packingQty || "",

      packingPrice: product.packingPrice || "",
    });

    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProduct(id, {
        ...formData,

        piecePrice: Number(formData.piecePrice),

        packingQty: formData.hasPacking ? Number(formData.packingQty) : 0,

        packingPrice: formData.hasPacking ? Number(formData.packingPrice) : 0,
      });

      await refreshProduct();

      setIsEditing(false);

      alert("Product updated successfully");
    } catch (error) {
      console.log(error);

      alert("Failed to update product");
    }
  };
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      alert("Product deleted successfully");

      navigate("/products");
    } catch (error) {
      console.log(error);

      alert("Failed to delete product");
    }
  };

  return (
    <MainLayout>
      <button className="back-btn" onClick={() => navigate("/products")}>
        ← Back to Products
      </button>

      <h1 className="page-title">Product Profile</h1>

      <div className="product-profile-card">
        {!isEditing ? (
          <>
            <h2 className="product-name">{product.name}</h2>
            <p className="product-info">
              <strong>Description:</strong> {product.description || "-"}
            </p>
            <p className="product-info">
              <strong>Piece Price:</strong> ₹{product.piecePrice}
            </p>

            <p className="product-info">
              <strong>Packing:</strong> {product.hasPacking ? "YES" : "NO"}
            </p>
            {product.hasPacking && (
              <>
                <p className="product-info">
                  <strong>Type:</strong> {product.packingType}
                </p>

                <p>Quantity : {product.packingQty}</p>

                <p>Packing Price : ₹{product.packingPrice}</p>
              </>
            )}
            <br />
            <div className="profile-actions">
              <button className="edit-btn" onClick={startEdit}>
                Edit Product
              </button>

              <button className="delete-btn" onClick={handleDelete}>
                Delete Product
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="product-edit-form">
              <input
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
              <br />
              <br />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <br />
            <br />
            <input
              type="number"
              placeholder="Piece Price"
              value={formData.piecePrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  piecePrice: e.target.value,
                })
              }
            />
            <br />
            <br />
            <label className="profile-checkbox">
              <input
                type="checkbox"
                checked={formData.hasPacking}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hasPacking: e.target.checked,
                  })
                }
              />{" "}
              Has Packing
            </label>
            <br />
            <br />
            {formData.hasPacking && (
              <>
                <select
                  value={formData.packingType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packingType: e.target.value,
                    })
                  }
                >
                  <option value="BOX">BOX</option>

                  <option value="BAG">BAG</option>
                </select>

                <br />
                <br />

                <input
                  type="number"
                  placeholder="Packing Quantity"
                  value={formData.packingQty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packingQty: e.target.value,
                    })
                  }
                />

                <br />
                <br />

                <input
                  type="number"
                  placeholder="Packing Price"
                  value={formData.packingPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packingPrice: e.target.value,
                    })
                  }
                />
              </>
            )}
            <br />
            <br />
            <div className="profile-actions">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default ProductProfilePage;
