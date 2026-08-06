import { useCallback, useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
} from "../services/categoryService";

function useCategories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
  });

  const loadCategories = useCallback(async (search = "") => {
    try {
      setLoading(true);

      const response = search
        ? await searchCategories(search)
        : await getCategories();

      const data =
  response?.categories || [];

setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);

      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const searchCategoryList = async ({ keyword }) => {
  const value = keyword.trim();

  setFilters({
    keyword: value,
  });

  await loadCategories(value);
};

  const addCategory = async (payload) => {
    try {
      setSaving(true);

      const response = await createCategory(payload);

      await loadCategories(filters.keyword);

      return response;
    } finally {
      setSaving(false);
    }
  };

  const editCategory = async (id, payload) => {
    try {
      setSaving(true);

      const response = await updateCategory(id, payload);

      await loadCategories(filters.keyword);

      return response;
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (id) => {
    try {
      setSaving(true);

      const response = await deleteCategory(id);

      await loadCategories(filters.keyword);

      return response;
    } finally {
      setSaving(false);
    }
  };

  return {
    categories,

    loading,

    saving,

    filters,

    loadCategories,

    searchCategoryList,

    addCategory,

    editCategory,

    removeCategory,
  };
}

export default useCategories;
