import { useEffect, useState } from "react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

import "./CategoryFormModal.css";

const DEFAULT_FORM = {
  name: "",
  description: "",
  sortOrder: 0,
  active: true,
};

function CategoryFormModal({ open, loading, category, onClose, onSave }) {
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setFormData(DEFAULT_FORM);
      setErrors({});
      return;
    }

    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        sortOrder: category.sortOrder ?? 0,
        active: category.active ?? true,
      });
    } else {
      setFormData(DEFAULT_FORM);
    }

    setErrors({});
  }, [open, category]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Category name is required.";
    }

    if (formData.name.trim().length > 100) {
      validationErrors.name = "Category name cannot exceed 100 characters.";
    }

    if (formData.description.length > 300) {
      validationErrors.description =
        "Description cannot exceed 300 characters.";
    }

    if (formData.sortOrder < 0) {
      validationErrors.sortOrder = "Sort Order cannot be negative.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    await onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      sortOrder: Number(formData.sortOrder),
      active: formData.active,
    });
  };
  return (
    <Modal
      open={open}
      title={category ? "Edit Category" : "Add Category"}
      onClose={loading ? () => {} : onClose}
    >
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label>Category Name *</label>

          <FormField
            autoFocus
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
          />

          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>

          <FormField
            as="textarea"
            rows={4}
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
          />

          {errors.description && (
            <p className="form-error">{errors.description}</p>
          )}
        </div>

        <div className="category-form-row">
          <div className="form-group">
            <label>Sort Order</label>

            <FormField
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={(e) => updateField("sortOrder", e.target.value)}
            />

            {errors.sortOrder && (
              <p className="form-error">{errors.sortOrder}</p>
            )}
          </div>

          <div className="form-group">
            <label>Status</label>

            <FormField
              as="select"
              value={String(formData.active)}
              onChange={(e) => updateField("active", e.target.value === "true")}
            >
              <option value="true">Active</option>

              <option value="false">Inactive</option>
            </FormField>
          </div>
        </div>

        <div className="category-form-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button type="submit" variant="success" loading={loading}>
            {category ? "Update Category" : "Save Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryFormModal;
