import { useMemo, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import EmptyState from "../../components/ui/EmptyState";

import useCategories from "../../hooks/useCategories";

import CategoryTable from "../../components/categories/CategoryTable";
import CategoryFormModal from "../../components/categories/CategoryFormModal";
import DeleteCategoryModal from "../../components/categories/DeleteCategoryModal";

import "./CategoriesPage.css";

function CategoriesPage() {
  const {
    categories,
    loading,
    saving,
    filters,
    searchCategoryList,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();

  const [formOpen, setFormOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [deletingCategory, setDeletingCategory] = useState(null);

  const pageTitle = useMemo(() => {
    return `${categories.length} Categories`;
  }, [categories]);

  const openAddModal = () => {
    setEditingCategory(null);

    setFormOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormOpen(true);
  };

  const closeFormModal = () => {
    if (saving) return;

    setEditingCategory(null);

    setFormOpen(false);
  };

  const openDeleteModal = (category) => {
    setDeletingCategory(category);

    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (saving) return;

    setDeletingCategory(null);

    setDeleteOpen(false);
  };

  const handleSave = async (formData) => {
    try {
      if (editingCategory) {
        await editCategory(editingCategory._id, formData);
      } else {
        await addCategory(formData);
      }

      closeFormModal();
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Unable to save category.");
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await removeCategory(deletingCategory._id);

      closeDeleteModal();
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Unable to delete category.");
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Category Master"
        subtitle={pageTitle}
        right={
          <Button variant="success" onClick={openAddModal}>
            + Add Category
          </Button>
        }
      />

      <Card title="Categories" subtitle="Manage product categories">
        <div className="categories-toolbar">
          <SearchInput
            value={filters.keyword}
            placeholder="Search category..."
            onChange={(value) =>
              searchCategoryList({
                keyword: value,
              })
            }
          />
        </div>
        {loading ? (
          <EmptyState text="Loading categories..." />
        ) : categories.length === 0 ? (
          <EmptyState text="No Categories Found" />
        ) : (
          <CategoryTable
            categories={categories}
            loading={saving}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </Card>

      <CategoryFormModal
        open={formOpen}
        loading={saving}
        category={editingCategory}
        onClose={closeFormModal}
        onSave={handleSave}
      />

      <DeleteCategoryModal
        open={deleteOpen}
        loading={saving}
        category={deletingCategory}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </MainLayout>
  );
}

export default CategoriesPage;
