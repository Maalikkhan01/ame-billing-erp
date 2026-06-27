import { useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import "./ProductProfilePage.css";

import useProductProfile from "../../hooks/useProductProfile";

import { updateProduct, deleteProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

function ProductProfilePage() {
  const { id } = useParams();

  const { product, loading, refreshProduct } = useProductProfile(id);

  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    units: [],
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

      units:
        product.units?.map((unit) => ({
          type: unit.type,
          price: unit.price,
        })) || [],
    });

    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProduct(id, {
        ...formData,

        units: formData.units.map((unit) => ({
          type: unit.type,
          price: Number(unit.price),
        })),
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
      <PageHeader
        title="Product Profile"
        right={
          <Button variant="secondary" onClick={() => navigate("/products")}>
            Back
          </Button>
        }
      />
      <Card>
        <h2 className="product-name">{product.name}</h2>

        {!isEditing ? (
          <>
            <div className="product-section">
              <h3>General Information</h3>

              <p className="product-info">
                <strong>Description:</strong>
                {product.description || "-"}
              </p>
            </div>

            <div className="product-section">
              <h3>Available Units</h3>

              {product.units?.map((unit) => (
                <p key={unit.type} className="product-info">
                  <strong>{unit.type}:</strong> ₹{unit.price}
                </p>
              ))}
            </div>

            <div className="profile-actions">
              <Button onClick={startEdit}>Edit Product</Button>

              <Button variant="danger" onClick={handleDelete}>
                Delete Product
              </Button>
            </div>
          </>
        ) : (
          <div className="product-edit-form">
            <FormField
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

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

            <div className="units-editor">
              <h3>Units</h3>

              {formData.units.map((unit, index) => (
                <div key={unit.type} className="unit-edit-row">
                  <span>{unit.type}</span>

                  <FormField
                    type="number"
                    value={unit.price}
                    onChange={(e) => {
                      const updated = [...formData.units];

                      updated[index].price = e.target.value;

                      setFormData({
                        ...formData,
                        units: updated,
                      });
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="profile-actions">
              <Button variant="success" onClick={handleSave}>
                Save
              </Button>

              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </MainLayout>
  );
}

export default ProductProfilePage;
