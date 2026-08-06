import ConfirmModal from "../ui/ConfirmModal";

function DeleteCategoryModal({
  open,
  loading,
  category,
  onClose,
  onConfirm,
}) {
  return (
    <ConfirmModal
      open={open}
      loading={loading}
      title="Delete Category"
      message={
        category
          ? `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
          : "Are you sure you want to delete this category?"
      }
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
}

export default DeleteCategoryModal;